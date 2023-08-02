aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 189018341439.dkr.ecr.us-east-1.amazonaws.com
docker build -t manage_team_member .
docker tag manage_team_member:latest 189018341439.dkr.ecr.us-east-1.amazonaws.com/manage_team_member:latest
docker push 189018341439.dkr.ecr.us-east-1.amazonaws.com/manage_team_member:latest
aws lambda update-function-code \
           --function-name manage_team_members \
           --image-uri 189018341439.dkr.ecr.us-east-1.amazonaws.com/manage_team_member:latest
docker image prune -a --force