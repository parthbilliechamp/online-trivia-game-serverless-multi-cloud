aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 189018341439.dkr.ecr.us-east-1.amazonaws.com   
docker build -t team_info .
docker tag team_info:latest 189018341439.dkr.ecr.us-east-1.amazonaws.com/team_info:latest
docker push 189018341439.dkr.ecr.us-east-1.amazonaws.com/team_info:latest
aws lambda update-function-code \
           --function-name team_info \
           --image-uri 189018341439.dkr.ecr.us-east-1.amazonaws.com/team_info:latest
docker image prune -a --force