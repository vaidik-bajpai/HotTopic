package mailer

import (
	"bytes"
	"embed"
	"fmt"
	"html/template"
	"log"
	"time"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
	"github.com/vaidik-bajpai/HotTopic/backend/internal/helper"
	"github.com/vaidik-bajpai/HotTopic/backend/internal/store"
)

//go:embed templates/*.templ
var templateFS embed.FS

var FromName = "HotTopic/backend"

type SendGridMailer struct {
	FromEmail string
	Client    *sendgrid.Client
}

func NewSendGridMailer(apiKey, fromEmail string) *SendGridMailer {
	client := sendgrid.NewSendClient(apiKey)
	return &SendGridMailer{
		FromEmail: fromEmail,
		Client:    client,
	}
}

func (m *SendGridMailer) SendActivationEmail(u *store.User, token string) error {
	if u.Email == "" {
		return fmt.Errorf("user has no email")
	}

	from := mail.NewEmail(FromName, m.FromEmail)
	to := mail.NewEmail(u.Username, u.Email)

	html, err := buildEmailFromTemplate("templates/activation.templ", u, token)
	if err != nil {
		log.Println("Error building activation email template:", err)
		return err
	}

	email := mail.NewSingleEmail(from, "Account activation mail", to, "", html)
	response, err := m.Client.Send(email)
	if err != nil {
		log.Println("Error sending email via SendGrid:", err)
		return err
	}

	log.Printf("SendGrid Response: Status Code: %d, Body: %s", response.StatusCode, response.Body)
	if response.StatusCode >= 400 {
		return fmt.Errorf("SendGrid error: %s", response.Body)
	}

	return nil
}

func (m *SendGridMailer) SendForgotPasswordEmail(u *store.User, token string) error {
	f, _ := templateFS.ReadDir("templates")
	for _, file := range f {
		fmt.Println(file.Name())
	}
	if u.Email == "" {
		return fmt.Errorf("user has no email")
	}

	from := mail.NewEmail(FromName, m.FromEmail)
	to := mail.NewEmail(u.Username, u.Email)

	html, err := buildEmailFromTemplate("templates/forgot-password.templ", u, token)
	if err != nil {
		log.Println("Error building forgot password email template:", err)
		return err
	}

	email := mail.NewSingleEmail(from, "Account forgot password email", to, "", html)
	response, err := m.Client.Send(email)
	if err != nil {
		log.Println("Error sending forgot password email:", err)
		return err
	}

	log.Printf("Forgot password email sent. Status Code: %d", response.StatusCode)
	return nil
}

func buildEmailFromTemplate(templateName string, u *store.User, token string) (string, error) {
	log.Printf("Loading template %s from embedded filesystem", templateName)

	templContent, err := templateFS.ReadFile(templateName)
	if err != nil {
		return "", fmt.Errorf("failed to read template %s: %w", templateName, err)
	}

	templ, err := template.New(templateName).Parse(string(templContent))
	if err != nil {
		return "", fmt.Errorf("failed to parse template %s: %w", templateName, err)
	}

	payload := struct {
		User           *store.User
		Token          string
		CurrentYear    int
		FrontendOrigin string
	}{
		User:           u,
		Token:          token,
		CurrentYear:    time.Now().Year(),
		FrontendOrigin: helper.GetEnvOrPanic("FRONTEND_ORIGIN"),
	}

	var out bytes.Buffer
	err = templ.Execute(&out, payload)
	if err != nil {
		return "", fmt.Errorf("failed to execute template %s: %w", templateName, err)
	}

	return out.String(), nil
}
