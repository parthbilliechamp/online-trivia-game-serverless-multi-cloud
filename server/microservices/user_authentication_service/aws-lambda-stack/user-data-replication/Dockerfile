# Use the official AWS Lambda Python runtime image
FROM public.ecr.aws/lambda/python:3.9

COPY private_key.json .
COPY . .

RUN pip3 install --no-cache-dir -r requirements.txt

# Set the command to run the Flask application
CMD ["lambda_function.lambda_handler"]