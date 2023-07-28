aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 189018341439.dkr.ecr.us-east-1.amazonaws.com   
docker build -t send_invitation .
docker tag send_invitation:latest 189018341439.dkr.ecr.us-east-1.amazonaws.com/send_invitation:latest
docker push 189018341439.dkr.ecr.us-east-1.amazonaws.com/send_invitation:latest
aws lambda update-function-code \
           --function-name send_invitaion \
           --image-uri 189018341439.dkr.ecr.us-east-1.amazonaws.com/send_invitation:latest
docker image prune -a --force