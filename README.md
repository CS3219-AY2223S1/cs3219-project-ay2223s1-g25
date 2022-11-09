# CS3219-AY22-23-Project

Access our deployed application [here!](https://d3end8d6ihgpl0.cloudfront.net/)

To setup our application locally, please follow the instructions below:

## Prerequisite
1. Install Docker Desktop
1. Create an [Auth0](https://auth0.com/signup) account
    1. Create an Auth0 Application (Single Page Application (SPA))
1. Create a [Cloud Atlas](https://account.mongodb.com/account/login/) account 
    1. Create a MongoDB connection
1. Create a [Redis Labs](https://app.redislabs.com/#/login) account
    1. Create a Redis Stack

**If you would like to use our configurations, please contact us directly.**

## Setup Backend
All our backend services are dockerized and can run using docker compose. However, you will need to configure some `.env` and `config.json` in order for it to work locally.
### API Gateway
1. Rename `config-sample.json` file to `config.json`.
1. If the `env` variable is `PROD`, the api-gateway will read the config file for the URL of each services (The URL in sample file are for docker configuration). Anything else as `env` will result in api-gateway using `localhost` for each services.
1. Using the Auth0 Application created, enter the `domain`, `clientId` and `audience` respectively into the `config.json` file.
    1. The `audience` should be the API URL to `Auth0 Management API`.

### Matching Service
1. Rename `config-sample.json` file to `config.json`.
1. Using the same Auth0 Application created for API gateway, enter the `domain`, `clientId` and `audience` respectively into the `config.json` file.
    1. The `audience` should be the API URL to `Auth0 Management API`.
1. Rename `.env-sample` file to `.env`.
1. The `APP_ORIGIN` variable should point to where your frontend is running. Default value is `http://localhost:3000`
1. Using the Redis Stack you created, enter the `REDIS_REMOTE_HOST`, `REDIS_REMOTE_PORT` and `REDIS_REMOTE_PASSWORD` respectively into the `.env` file.

### Question Service
1. Rename `config-sample.json` file to `config.json`.
1. Using the Auth0 Application created, enter the `domain`, `clientId` and `audience` respectively into the `config.json` file.
    1. The `audience` should be the API URL to `Auth0 Management API`.
1. Rename `.env-sample` file to `.env`.
1. If the `ENV` variable is `PROD`, the question service will read the config file for the URL of the MongoDB. Anything else as `env` will result in question service using the mongodb running at `localhost`.
1. Using the MongoDB connection you created, enter the connection string as `DB_CLOUD_URI` in `.env` file.
1. Using the Redis Stack you created, enter the `REDIS_REMOTE_HOST`, `REDIS_REMOTE_PORT` and `REDIS_REMOTE_PASSWORD` respectively into the `.env` file.

After you configured all the environment and configuration for all the services above, you may go back to the root repo and run:
```
docker-compose up --build -d
```
This will bring up the docker containers for the backend.

If you would like to run each services individually, you may go into the service and run:
1. Install npm packages using `npm i`.
1. Run service using `npm start`.

**NOTE: Ensure you did not set the `env` in `config.json` in API gateway to `PROD` as that will NOT connect to the services running locally.**

## Setup Frontend
1. Rename `config-sample.json` file to `config.json`.
1. The `API_URL` variable should point to where your backend is running. Default value is `http://localhost:3001`
1. Using the same Auth0 Application created for API gateway, enter the `domain`, `clientId` and `audience` respectively into the `config.json` file.
    1. The `audience` should be the API URL to `Auth0 Management API`.
1. Install npm packages using `npm i`.
1. Run Frontend using `npm start`.
