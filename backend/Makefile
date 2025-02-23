SCHEMA_PATH = ./internal/db/schema.prisma

prisma-gen:
	go run github.com/steebchen/prisma-client-go generate --schema $(SCHEMA_PATH)
 
prisma-push:
	go run github.com/steebchen/prisma-client-go db push --schema $(SCHEMA_PATH)
 
prisma-pull:
	go run github.com/steebchen/prisma-client-go db pull
 
prisma-migrate:
	go run github.com/steebchen/prisma-client-go migrate dev
 
prisma-mig-deploy:
	go run github.com/steebchen/prisma-client-go migrate deploy

postgres-shell:
	docker exec -it HotTopic psql -U bajpai -d hottopic