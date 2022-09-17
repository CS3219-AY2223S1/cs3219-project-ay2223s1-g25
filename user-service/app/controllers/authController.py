import boto3
from app.pycognito.aws_srp import AWSSRP
from app.pycognito.exceptions import ForceChangePasswordException
from botocore.exceptions import ClientError
import app.awsconfig as config

APP_CLIENT_ID = config.APP_CLIENT_ID
APP_USER_POOL_ID = config.APP_USER_POOL_ID
APP_CLIENT_SECRET = config.APP_CLIENT_SECRET
SERVICE = "cognito-idp"
REGION = config.REGION
USER_POOL_URL = "{}.{}.amazonaws.com/{}".format(SERVICE,REGION,APP_USER_POOL_ID)
client = boto3.client('cognito-idp')

NEW_PASSWORD_REQUIRED = "NEW_PASSWORD_REQUIRED"
UNKNOWN_ERROR = "UNKNOWN_ERROR"
AUTH_SUCCESS = "AUTH_SUCCESS"
USER_NOT_CONFIRMED = "UserNotConfirmedException"

def getTokens(response):
    tokens = {}
    tokens["IdToken"] = response["AuthenticationResult"]["IdToken"]
    tokens["AccessToken"] = response["AuthenticationResult"]["AccessToken"]
    return tokens

def authenticateUser(username,password):
    try:
        aws = AWSSRP(username=username,password=password,pool_id=APP_USER_POOL_ID,client_id=APP_CLIENT_ID, client_secret=APP_CLIENT_SECRET, client=client)
        response = aws.authenticate_user()
    except ForceChangePasswordException as e:
        return (NEW_PASSWORD_REQUIRED, e.session)
    except ClientError as e:
        if e.response['Error']['Code'] == 'NotAuthorizedException':
            return (None, None)
        elif e.response['Error']['Code'] == 'UserNotConfirmedException':
            return (USER_NOT_CONFIRMED, None)
        else:
            print(e)
            return (UNKNOWN_ERROR, None)
    if "ChallengeName" not in response and response["ResponseMetadata"]["HTTPStatusCode"] == 200:
        return (AUTH_SUCCESS, getTokens(response))

    
    return (UNKNOWN_ERROR, response["Session"])


def updatePassword(session,username,password,name):
    try:
        response = client.respond_to_auth_challenge(
            ClientId=APP_CLIENT_ID,
            Session=session,
            ChallengeName=NEW_PASSWORD_REQUIRED,
            ChallengeResponses={
                'USERNAME': username,
                'NEW_PASSWORD': password,
                'SECRET_HASH': AWSSRP.get_secret_hash(username, APP_CLIENT_ID, APP_CLIENT_SECRET),
                'userAttributes.name': name
            },
            
        )
    except ClientError as e:
        if e.response['Error']['Code'] == 'InvalidPasswordException':
            return (None, None, e.response['Error']['Message'])
        else:
            print(e)
            return (UNKNOWN_ERROR, None, None)
    if "ChallengeName" not in response and response["ResponseMetadata"]["HTTPStatusCode"] == 200:
        return (AUTH_SUCCESS, getTokens(response), None)


def forgotPassword(username):
    response = client.forgot_password(
        ClientId = APP_CLIENT_ID,
        Username = username,
        SecretHash=AWSSRP.get_secret_hash(username, APP_CLIENT_ID, APP_CLIENT_SECRET)
    )

def register(username, password, name):
    try:
        response = client.sign_up(
            ClientId=APP_CLIENT_ID,
            Username=username,
            Password=password,
            SecretHash=AWSSRP.get_secret_hash(username, APP_CLIENT_ID, APP_CLIENT_SECRET),
            UserAttributes=[
                {
                    'Name': 'name',
                    'Value': name
                },
            ]
        )
    except ClientError as e:
        if e.response['Error']['Code'] == 'UsernameExistsException':
            return e.response['Error']['Message']

def emailVerification(username, vcode):
    try:
        response = client.confirm_sign_up(
            ClientId=APP_CLIENT_ID,
            SecretHash=AWSSRP.get_secret_hash(username, APP_CLIENT_ID, APP_CLIENT_SECRET),
            Username=username,
            ConfirmationCode=vcode)
    except ClientError as e:
        if e.response['Error']['Code'] == 'ExpiredCodeException':
            return e.response['Error']['Message']
        elif e.response['Error']['Code'] == 'LimitExceededException':
            return e.response['Error']['Message']
        elif e.response['Error']['Code'] == 'CodeMismatchException':
            return e.response['Error']['Message']
        else:
            print(e.response['Error'])
            return UNKNOWN_ERROR
    return None

def resetPassword(username, code, password):
    try:
        response = client.confirm_forgot_password(
            ClientId = APP_CLIENT_ID,
            SecretHash=AWSSRP.get_secret_hash(username, APP_CLIENT_ID, APP_CLIENT_SECRET),
            Username=username,
            ConfirmationCode=code,
            Password=password)
    except ClientError as e:
        if e.response['Error']['Code'] == 'ExpiredCodeException':
            return e.response['Error']['Message']
        elif e.response['Error']['Code'] == 'LimitExceededException':
            return e.response['Error']['Message']
        elif e.response['Error']['Code'] == 'CodeMismatchException':
            return e.response['Error']['Message']
        else:
            print(e.response['Error'])
            return UNKNOWN_ERROR
    return None
