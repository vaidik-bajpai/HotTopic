FROM golang:1.23-bullseye as base

WORKDIR /workspace

# Add go modules lockfiles
COPY go.mod go.sum ./
RUN go mod download

# Prefetch the binaries, so that they will be cached and not downloaded on each change
RUN go run github.com/steebchen/prisma-client-go prefetch

# Development stage
FROM base as dev

# Install air for hot reload & delve for debugging
RUN go install github.com/air-verse/air@latest && \
    go install github.com/go-delve/delve/cmd/dlv@latest

COPY . ./

# Generate the Prisma Client Go client
RUN go run github.com/steebchen/prisma-client-go generate --schema ./internal/db/schema.prisma

# Use air for hot reload in development
CMD ["air", "-c", ".air.toml"]

# Build stage for production
FROM base as build

COPY . ./

# Generate the Prisma Client Go client
RUN go run github.com/steebchen/prisma-client-go generate --schema ./internal/db/schema.prisma

# Build the binary with all dependencies
RUN CGO_ENABLED=0 go build -ldflags="-w -s" -o /app ./cmd

# Production stage
FROM debian:bullseye-slim as production

# Install ca-certificates for HTTPS requests
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -r -u 1001 appuser

# Copy the binary from build stage
COPY --from=build /app /app

# Copy Go module cache with Prisma binaries
COPY --from=build /go/pkg/mod /go/pkg/mod

# Set Go environment variables
ENV GOPATH=/go

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

CMD ["/app"]