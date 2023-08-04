aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 227165718467.dkr.ecr.us-east-1.amazonaws.com
docker build --platform=linux/amd64 -t triviaquiz .
docker tag triviaquiz:latest 227165718467.dkr.ecr.us-east-1.amazonaws.com/triviaquiz:latest
docker push 227165718467.dkr.ecr.us-east-1.amazonaws.com/triviaquiz:latest
aws lambda UserDataReplication \
           --function-name UserDataReplication \
           --image-uri 227165718467.dkr.ecr.us-east-1.amazonaws.com/triviaquiz:latest
docker image prune -a --force