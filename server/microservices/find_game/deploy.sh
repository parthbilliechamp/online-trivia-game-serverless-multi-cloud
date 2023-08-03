aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 189018341439.dkr.ecr.us-east-1.amazonaws.com   
docker build -t find_game .
docker tag find_game:latest 189018341439.dkr.ecr.us-east-1.amazonaws.com/find_game:latest
docker push 189018341439.dkr.ecr.us-east-1.amazonaws.com/find_game:latest
aws lambda update-function-code \
           --function-name find_game \
           --image-uri 189018341439.dkr.ecr.us-east-1.amazonaws.com/find_game:latest
docker image prune -a --force