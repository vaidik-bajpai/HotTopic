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

signin:
	curl -c json/cookies.txt -X POST "http://localhost:3000/auth/signin" \
     -H "Content-Type: application/json" \
     -d @json/auth/signin.json -w "\n"

signup:
	curl -X POST "http://localhost:3000/auth/signup" \
     -H "Content-Type: application/json" \
     -d @json/auth/signup.json -w "\n"

createPost:
	curl -b json/cookies.txt -X POST "http://localhost:3000/post/create" \
		-H "Content-Type: application/json" \
		-d @json/post/create.json -w "\n"

getPost:
	curl -b json/cookies.txt -X GET "http://localhost:3000/post/1d178a2a-7177-4a01-9e7b-0c523e37d622?page_size=10" \
   		-H "Content-Type: application/json" -w "\n"

likePost:
	curl -b json/cookies.txt -X POST "http://localhost:3000/post/40bfdc9b-eba4-4fa7-9e1d-624a227b9b89/like" \
		-H "Content-Type: application/json" -w "\n"

unLikePost:
	curl -b json/cookies.txt -X POST "http://localhost:3000/post/40bfdc9b-eba4-4fa7-9e1d-624a227b9b89/unlike" \
		-H "Content-Type: application/json" -w "\n"

savePost:
	curl -b json/cookies.txt -X POST "http://localhost:3000/post/40bfdc9b-eba4-4fa7-9e1d-624a227b9b89/save" \
		-H "Content-Type: application/json" -w "\n"

unSavePost:
	curl -b json/cookies.txt -X POST "http://localhost:3000/post/40bfdc9b-eba4-4fa7-9e1d-624a227b9b89/unsave" \
		-H "Content-Type: application/json" -w "\n"

followUser:
	curl -b json/cookies/txt -X POST "http://localhost:3000/user/{userID}/follow" \
		-H "Content-Type: application/json" -w "\n"

unFollowUser:
	curl -b json/cookies/txt -X POST "http://localhost:3000/user/{userID}/unfollow" \
		-H "Content-Type: application/json" -w "\n"