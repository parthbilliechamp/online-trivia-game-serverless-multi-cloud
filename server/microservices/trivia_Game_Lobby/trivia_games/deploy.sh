aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 189018341439.dkr.ecr.us-east-1.amazonaws.com
docker build -t trivia .
docker tag trivia:latest 189018341439.dkr.ecr.us-east-1.amazonaws.com/trivia:latest
docker push 189018341439.dkr.ecr.us-east-1.amazonaws.com/trivia:latest
aws lambda update-function-code \
           --function-name lambda_final1 \
           --image-uri 189018341439.dkr.ecr.us-east-1.amazonaws.com/trivia:latest
docker image prune -a --force
docker system prune -a -y