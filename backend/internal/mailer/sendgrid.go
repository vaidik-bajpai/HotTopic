package mailer

import (
	"bytes"
	"fmt"
	"html/template"
	"log"
	"path/filepath"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
	"github.com/vaidik-bajpai/gopher-social/internal/store"
)

var FromName = "Hottopic"

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
	subject := "Account activation mail"
	userName := u.Username
	to := mail.NewEmail(userName, u.Email)

	html, err := BuildActivationMailTemplate(u, token)
	if err != nil {
		log.Println("Error building activation email template:", err)
		return err
	}

	email := mail.NewSingleEmail(from, subject, to, "", html)
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
	if u.Email == "" {
		return fmt.Errorf("user has no email")
	}

	from := mail.NewEmail(FromName, m.FromEmail)
	subject := "Account forgot password email"
	userName := u.Username

	to := mail.NewEmail(userName, u.Email)

	html, err := BuildForgotPasswordMailTemplate(u, token)
	if err != nil {
		return err
	}

	email := mail.NewSingleEmail(from, subject, to, "", html)
	_, err = m.Client.Send(email)
	if err != nil {
		return err
	}

	return nil
}

func (m *SendGridMailer) TestEmail(subject, toEmail, content string) error {
	if toEmail == "" {
		return fmt.Errorf("user has no email")
	}

	from := mail.NewEmail(FromName, m.FromEmail)

	to := mail.NewEmail("test email", toEmail)

	email := mail.NewSingleEmail(from, subject, to, "", content)
	_, err := m.Client.Send(email)
	if err != nil {
		return err
	}

	return nil
}

func BuildActivationMailTemplate(u *store.User, token string) (string, error) {
	path, err := filepath.Abs("internal/mailer/activation.templ")
	if err != nil {
		log.Println("Error getting absolute path:", err)
		return "", err
	}
	log.Println("Loading template from:", path)

	templ, err := template.ParseFiles(path)
	if err != nil {
		return "", err
	}

	payload := struct {
		User  *store.User
		Token string
	}{
		User:  u,
		Token: token,
	}

	var out bytes.Buffer
	err = templ.Execute(&out, payload)
	if err != nil {
		return "", err
	}

	return out.String(), nil
}

func BuildForgotPasswordMailTemplate(u *store.User, token string) (string, error) {
	path, err := filepath.Abs("internal/mailer/forgot-password.templ")
	if err != nil {
		log.Println("Error getting absolute path:", err)
		return "", err
	}
	log.Println("Loading template from:", path)

	templ, err := template.ParseFiles(path)
	if err != nil {
		return "", err
	}

	payload := struct {
		User  *store.User
		Token string
	}{
		User:  u,
		Token: token,
	}

	var out bytes.Buffer
	err = templ.Execute(&out, payload)
	if err != nil {
		return "", err
	}

	return out.String(), nil
}
