aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 189018341439.dkr.ecr.us-east-1.amazonaws.com   
docker build -t create_team .
docker tag create_team:latest 189018341439.dkr.ecr.us-east-1.amazonaws.com/create_team:latest
docker push 189018341439.dkr.ecr.us-east-1.amazonaws.com/create_team:latest
aws lambda update-function-code \
           --function-name CreateTeam \
           --image-uri 189018341439.dkr.ecr.us-east-1.amazonaws.com/create_team:latest
docker image prune -a --force