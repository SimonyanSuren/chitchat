# Chat Application (Dockerized)

Welcome to our Chat Application! This application allows you to chat with others.
It has been containerized using Docker for easy deployment and management.

## Getting Started

Follow these instructions to run the Chat Application on your local environment using Docker.

### Prerequisites

You need the following tools installed on your system:

- [Docker](https://www.docker.com/get-started)

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
$ docker-compose up -d
```

This command will start the Chat Application, including the MongoDB database, in detached mode. You can access the application swagger UI in your web browser at http://localhost:9090/swagger.

Stopping the Application
To stop the application and remove the containers, run:

```bash
$ docker-compose down
```