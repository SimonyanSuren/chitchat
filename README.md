# ChitChat Application API (Dockerized)

Welcome to the ChitChat Application API! This backend service is an integral part of the ChitChat messaging application. The ChitChat Application API has been containerized using Docker for simplified deployment and efficient management.

## Overview

ChitChat is a messaging application designed to facilitate seamless communication among users. This repository represents the backend of the ChitChat application, which has been developed using the NestJS framework and relies on MongoDB as its database.

## Getting Started

Follow these instructions to run the Chat Application on your local environment using Docker.

### Prerequisites

You need the following tools installed on your system:

- [Docker](https://www.docker.com/get-started)

### Environment Variables Configuration

Before running the API, you must configure the required environment variables.

### Docker Setup

1. Clone this repository to your local machine:

```bash
   $ git clone git@github.com:SimonyanSuren/chitchat-api.git
   $ cd chitchat-api
```

2. Generate a secure key for MongoDB (required for replica set authentication):

```bash
$ openssl rand -base64 756 > ./.docker/mongodb/file.key
```

3. Set appropriate permissions for the key file:

```bash
$ chmod 400 ./.docker/mongodb/file.key
$ sudo chown 999:999 ./.docker/mongodb/file.key
```

### Running the Application

Use Docker Compose to start the application containers:

```bash
$ docker compose up -d
```

This command will start the Node.js server, including the MongoDB database, in detached mode. You can access the application swagger UI in your web browser at http://localhost:9090/swagger.

### Stopping the Application

To stop the application and remove the containers, run:

```bash
$ docker compose down
```
