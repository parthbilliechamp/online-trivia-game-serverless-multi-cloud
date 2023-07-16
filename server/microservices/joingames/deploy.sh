aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 189018341439.dkr.ecr.us-east-1.amazonaws.com
docker build -t join_game .
docker tag join_game:latest 189018341439.dkr.ecr.us-east-1.amazonaws.com/join_game:latest
docker push 189018341439.dkr.ecr.us-east-1.amazonaws.com/join_game:latest
aws lambda update-function-code \
           --function-name join_game_container \
           --image-uri 189018341439.dkr.ecr.us-east-1.amazonaws.com/join_game:latest
docker image prune -a --force