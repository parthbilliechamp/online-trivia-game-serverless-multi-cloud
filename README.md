
# Online Multiplayer Trivia Quiz App

# A multi-cloud serverless web application built with AWS and GCP

<p align="center">
<img width="640px"  src="https://parthchampaneria-portfolio.s3.amazonaws.com/triviahomepage.png" alt="">
<p>

- [Introduction & Goals](#introduction--goals)
- [Tools used](#tools)
- [Services used](#services-used)
  - [Connect](#connect)
  - [Buffer](#buffer)
  - [Processing](#processing)
  - [Storage](#storage)
  - [Visualization](#visualization)
- [Pipeline](#pipeline)
  - [Introduction](#introduction)
  - [Data Preprocessing](#data-preprocessing)
  - [Azure APIM, Azure Functions, Blob Storage](#azure-apim-azure-functions-blob-storage)
  - [Azure Event Hubs, Function and Cosmos DB](#azure-event-hubs-function-and-cosmos-db)
- [Author: 👤 **Kristijan Bakaric**](#author--kristijan-bakaric)
- [Follow Me On](#follow-me-on)
  - [Show your support](#show-your-support)
  - [Links used along the project](#links-used-along-the-project)


# Introduction & Goals


**Main goals:**
Create a multi-cloud serverless trivia game that enables real-time team competition, personalized questions, and analytics for administrators to enhance user engagement and gameplay.


# Tools
  
  - [Visual Studio Code](https://code.visualstudio.com/)
    - IDE for development

  - Python and its libraries - Pandas, Requests, boto3, Flask
    - For implementing the backend services
  
  - [Docker](https://www.docker.com/) 
    - For deployment of the application
  
  - AWS SDK and GCP SDK
    - For working with AWS and GCP services


# Services used

## User Authentication and Authorization

- [AWS Cognito]
  >> For managing user database and authenticating users

- [GCP Firestore + GCP Functions]
  >> For second-level user authorization

## User Profile Management

- TO BE ADDED

# Deployment Pipeline

A CI/CD pipeline has been configured for deploying the React-based frontend application, containerized with Docker and hosted on Google Cloud Platform's Cloud Run, as depicted in the figure below

<p align="center">
<img width="640px"  src="https://projects-mediahouse.s3.amazonaws.com/trivia-serverless/deployment-pipeline.png" alt="">
<p>

## [Introduction](https://baky0905.github.io/personal-website/blog/2021/02/28/data-engineering-part1)

The upcoming posts will consist of writing about:

- Python functions and modules that process the data from Kaggle, combine tweets and satellite images into a single file acting as a source of streaming data and building a python program that will send requests to an Azure API endpoint.

- Azure streaming data pipeline that:

  - Ingests tweets from the local source client via Azure API management having an Azure Function as a backend.

  - Utilizes Azure Event Hub as a message queue service.

  - Azure Function that takes messages from Azure Event Hub and writes them to Azure Cosmos Database.

You can read more in the following  **[BLOG POST](https://baky0905.github.io/personal-website/blog/2021/02/28/data-engineering-part1)**.

## [Data Preprocessing](https://baky0905.github.io/personal-website/blog/2021/03/06/data-engineering-part2)

![image](https://user-images.githubusercontent.com/25346727/113972713-64689500-983b-11eb-8cda-35eae477390a.png)

In figure above, there is a high-level overview of what are the inputs and what are the outputs of the data processing, with the main aim of generating a JSON file that contains messages which I will send via HTTP requests to the Azure API Management API endpoint.

You can read more in the following **[BLOG POST](https://baky0905.github.io/personal-website/blog/2021/03/06/data-engineering-part2)**.

## [Azure APIM, Azure Functions, Blob Storage](https://baky0905.github.io/personal-website/blog/2021/03/07/data-engineering-part3)

![image](https://user-images.githubusercontent.com/25346727/113972837-9ed23200-983b-11eb-8277-8a8ff569eeff.png)

Now that we have the data in the desired format and with the relevant content, we can embark in the world of Azure where we will select a suite of services that will assist us in reaching our goal, and that is to build a data streaming pipeline.

In this blog post I touch upon following Azure services (see also the diagram below):

- Azure API Management

- Azure Functions

- Azure Key Vault

- Azure Blob Storage

You can read more in the following  **[BLOG POST](https://baky0905.github.io/personal-website/blog/2021/03/07/data-engineering-part3)**.

## [Azure Event Hubs, Function and Cosmos DB](https://baky0905.github.io/personal-website/blog/2021/03/08/data-engineering-part4)

![image](https://user-images.githubusercontent.com/25346727/113972919-c6c19580-983b-11eb-9e5f-20ee8611728c.png)

In this post, I will cover the section of the pipeline that goes from event Ingestor - Azure Event Hubs to writing messages in a No-SQL CosmosDB, and finally querying the database via Power BI Desktop connector with a few simple charts.

You can read more in the following **[BLOG POST](https://baky0905.github.io/personal-website/blog/2021/03/08/data-engineering-part4)**.

![image](https://user-images.githubusercontent.com/25346727/113972936-cb864980-983b-11eb-8cfd-06ac8beb41ac.png)


# Author: 👤 **Parth Champaneria**

## Show your support

Give a ⭐️ if this project helped you!
