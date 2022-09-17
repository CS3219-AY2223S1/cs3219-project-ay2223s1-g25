from flask import Flask

app = Flask(__name__)
app.secret_key = b'\xe8DA\xb4\x88{\xf1\x01$\xd1\x0e\x8f0\xef\x19\xfd\xbd\xc2\xf9\x07D\x9aXZ'

from app import routes