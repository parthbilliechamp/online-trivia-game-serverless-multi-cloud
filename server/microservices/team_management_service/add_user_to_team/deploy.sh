aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 189018341439.dkr.ecr.us-east-1.amazonaws.com 
docker build -t add_invited_user .
docker tag add_invited_user:latest 189018341439.dkr.ecr.us-east-1.amazonaws.com/add_invited_user:latest
docker push 189018341439.dkr.ecr.us-east-1.amazonaws.com/add_invited_user:latest
aws lambda update-function-code \
           --function-name add_invited_user \
           --image-uri 189018341439.dkr.ecr.us-east-1.amazonaws.com/add_invited_user:latest
docker image prune -a --force