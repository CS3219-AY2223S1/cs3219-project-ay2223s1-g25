# CS3219-AY22-23-Project

Access our deployed application [here!](https://d3end8d6ihgpl0.cloudfront.net/)

To setup our application locally, please follow the instructions below:

## Prerequisite
1. Install Docker Desktop
1. Create an [Auth0](https://auth0.com/signup) account
    1. Create an Auth0 Application (Single Page Application (SPA))
        1. Ensure you add the URL of the frontend (default value http://localhost:3000) to the following:
            * Allowed Callback URLs
            * Allowed Logout URLs
            * Allowed Web Origins
            * Allowed Origins (CORS)
        1. Under Advanced Settings for the application, ensure that `password` is enabled for `Grants` under the `Grant Types`
        1. Next, go to Auth0 settings (settings on the left navigation) and under the general tab, scroll down to `API Authorization Settings`. Add `Username-Password-Authentication` to `Default Directory`.
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
1. The `appOrigin` variable should point to where your frontend is running. Default value is `http://localhost:3000`
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

### Setting Up backend without docker
If you would like to run each services individually, you may go into the service and run:
1. Install npm packages using `npm i`.
1. Run service using `npm start`.

**NOTE: Ensure you did not set the `env` in `config.json` in API gateway to `PROD` as that will NOT connect to the services running locally.**

## Populate Question Service
1. Rename `config-sample.json` file to `config.json`.
2. Using the Auth0 Application created, enter the `domain`, `clientId` and `audience` respectively into the `config.json` file.
3. The `API_URL` variable should point to where your backend is running. Default value is `http://localhost:3001`
4. Rename `.env-sample` file to `.env`.
5. Using the Auth0 Application created, enter the `CLIENT_SECRET` into the `.env` file.
6. Create your own user in Auth0 (Auth0 -> user management -> create user)
7. Using the user you created in Auth0, enter the `USER_NAME` and `PASSWORD` respectively into the `.env` file.
8. Run service using `node populateQuestions.js` and wait about 1 minute. Upon successful you should see a log message similar to the one below:
[! populateQuestion output](diagrams/populate_question_output.jpg)

## Setup Frontend
1. Rename `config-sample.json` file to `config.json`.
1. The `API_URL` variable should point to where your backend is running. Default value is `http://localhost:3001`
1. Using the same Auth0 Application created for API gateway, enter the `domain`, `clientId` and `audience` respectively into the `config.json` file.
    1. The `audience` should be the API URL to `Auth0 Management API`.
1. Install npm packages using `npm i`.
1. Run Frontend using `npm start`.
