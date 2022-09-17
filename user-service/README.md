# User Service

The user service is built using python Flask and AWS Cognito. It communicates with AWS Cognito service to create users, verify users, as well as to authenticate the users. After successful authentication, the user service will return a set of user tokens which can be used to authenticate the user for AWS services.

## Tech stack

- AWS Cognito
- Python
- Flask
- Zappa
