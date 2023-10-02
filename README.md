
# Online Multiplayer Trivia Quiz App

# A multi-cloud serverless web application built with AWS and GCP

<p align="center">
<img width="640px"  src="https://parthchampaneria-portfolio.s3.amazonaws.com/triviahomepage.png" alt="">
<p>

- [Introduction & Goals](#introduction--goals)
- [Project Architecture](#project-architecture)
- [Tools and Technologies used](#tools)
- [Services used](#services-used)
  - [User Authentication and Authorization](#User-Authentication-and-Authorization)
  - [User Profile Management](#User-Profile-Management)
  - [Game LeaderBoard](#Game-LeaderBoard)
  - [Team Management](#Team-Management)
  - [Chat Bot for Virtual assistance](#Chat-Bot-for-Virtual-assistance)
  - [Admin Dashboard](#Admin-Dashboard)
  - [Game Module](#Game-Module)
- [Deployment Pipeline](#deployment-pipeline)
- [Project Demo](#project-demo)
- [Author: 👤 **Parth Champaneria**](#author--parth-champaneria)
- [Show your support](#show-your-support)


# Introduction & Goals


**Main goals:**
Create a multi-cloud serverless trivia game that enables real-time team competition, personalized questions, and analytics for administrators to enhance user engagement and gameplay.

# Project architecture

<p align="center">
<img width="720px"  src="https://projects-mediahouse.s3.amazonaws.com/trivia-serverless/architecture.png" alt="">
<p>


# Tools

  - Python and its libraries - Pandas, Requests, boto3, Flask
    - For implementing the backend services
  
  - [Docker](https://www.docker.com/) 
    - For deployment of the application
  
  - AWS SDK and GCP SDK
    - For working with AWS and GCP services
   
  - [React JS](https://react.dev/)
    - For developing the front end of the application
      
  - [Visual Studio Code](https://code.visualstudio.com/)
    - IDE for development
   
  - [Serverless Framework](https://www.serverless.com/)
    - For deployment of Lambda and GCP functions 


# Services used

## User Authentication and Authorization

- [AWS Cognito]
  >> For managing user database and authenticating users

- [GCP Firestore + GCP Functions]
  >> For second-level user authorization

## User Profile Management

- [AWS Lambda]
  >> For user profile CRUD operations

- [Amazon DynamoDB]
  >> For storing User session data

## Game LeaderBoard

- [Amazon S3]
  >> For storing game results data

- [AWS Athena]
  >> For creating external tables and views like Top Users, Top teams, etc.

- [AWS QuickSight]
  >> For creating the visual leaderboard


## Team Management

- [AWS Lambda]
  >> For creating and managing teams. (CRUD operations)

- [AWS Secrets Key Manager]
  >> For storing OpenAI API key. (Used for automatic team name generation)

- [AWS API Gateway]
  >> For creating Rest APIs

## Chat Bot for Virtual assistance

- [AWS Lex V2]
  >> For creating the bot to interact with the users

- [AWS Lambda]
  >> For integrating Lex with DynamoDB tables

## Admin Dashboard

- [AWS QuickSight]
  >> For creating the admin dashboard

- [AWS Lambda]
  >> For creating the CRUD operations for admin tasks like adding questions.

## Game Module

- [GCP Functions]
  >> For creating the in-game user experience

- [Amazon DynamoDB]
  >> For storing the game-related data.

# Deployment Pipeline

A CI/CD pipeline has been configured for deploying the React-based frontend application, containerized with Docker and hosted on Google Cloud Platform's Cloud Run, as depicted in the figure below

<p align="center">
<img width="640px"  src="https://projects-mediahouse.s3.amazonaws.com/trivia-serverless/deployment-pipeline.png" alt="">
<p>

# Project Demo

- The project demo can be viewed [here](https://projects-mediahouse.s3.amazonaws.com/trivia-serverless/demo.mp4)


# Author: 👤 **Parth Champaneria**

# Show your support

Give a ⭐️ if this project helped you!
