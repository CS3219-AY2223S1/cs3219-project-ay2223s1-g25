from flask import render_template, request, flash, redirect, url_for, session
import app.controllers.authController as ctrl_auth
from app import app


@app.route("/", methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template("auth/login.html")
    else:
        result, sessionToken = ctrl_auth.authenticateUser(request.form["username"],request.form["password"])
        if result == ctrl_auth.AUTH_SUCCESS:
            # return (sessionToken["IdToken"], sessionToken["AccessToken"])
            return "Logged in, to return tokens to whoever enters here"
        session["session"] = sessionToken
        session["username"] = request.form["username"]
        if result == ctrl_auth.NEW_PASSWORD_REQUIRED:
            return redirect(url_for('updatePassword'))
        elif result == ctrl_auth.USER_NOT_CONFIRMED:
            return redirect(url_for('verification', verificationType='Email'))
        elif result == ctrl_auth.UNKNOWN_ERROR:
            flash('Server Error, Please try again later.',"danger")
            del session["session"]
            del session["username"]
            return redirect(url_for('login'))
        else:
            flash('Invalid username or password.',"danger")
            return redirect(url_for('login'))

@app.route("/verification/<verificationType>", methods=['GET', 'POST'])
def verification(verificationType):
    if "username" not in session and verificationType == 'Email':
        return redirect(url_for('login'))
    if request.method == 'GET':
        return render_template("auth/verification.html", verificationType=verificationType)
    if verificationType == 'Email':
        error = ctrl_auth.emailVerification(session["username"], request.form["totp"])
        if error:
            if error == ctrl_auth.UNKNOWN_ERROR:
                flash('Server Error, Please try again later.',"danger")
                del session["username"]
                return redirect(url_for('login'))
            else:
                flash(error, "danger")
        else:
            flash('User account created successfully, Please login again.',"success")
            return redirect(url_for('login'))
    return redirect(url_for('verification', verificationType=verificationType))

@app.route("/updatePassword", methods=['GET', 'POST'])
def updatePassword():
    if "session" not in session:
        return redirect(url_for('login'))
    if request.method == 'GET':
        return render_template("auth/update_password.html")
    result, sessionToken, data = ctrl_auth.updatePassword(session["session"], session["username"], request.form["newPassword"],request.form["fullName"])
    if result == ctrl_auth.AUTH_SUCCESS:
            return "Logged in, to return tokens to whoever enters here"
    elif result == ctrl_auth.UNKNOWN_ERROR:
        flash('Server Error, Please try again later.',"danger")
        del session["session"]
        del session["username"]
        return redirect(url_for('login'))
    else:
        flash(data,"danger")
        return redirect(url_for('updatePassword'))

@app.route("/resetPassword", methods=['GET', 'POST'])
def resetPassword():
    if request.method == 'GET':
        return render_template("auth/reset_password.html")
    email = request.form.get("email")
    vcode = request.form.get("vcode")
    password = request.form.get("newPassword")
    username = request.form.get("username")
    if email:
        ctrl_auth.forgotPassword(email)
    elif vcode and password and username:
        error = ctrl_auth.resetPassword(username,vcode,password)
        if error:
            if error == ctrl_auth.UNKNOWN_ERROR:
                flash('Server Error, Please try again later.',"danger")
            else:
                flash(error, "danger")    
            return render_template("auth/reset_password.html", codeSent = True, email=username)
        else:
            flash('Password reset successful, Please login again.',"success")
            return redirect(url_for('login'))
    else:
        flash('Invalid data entered, please try again.',"danger")
        return render_template("auth/reset_password.html")

    return render_template("auth/reset_password.html", codeSent = True, email=email)


@app.route("/registerAccount", methods=['GET', 'POST'])
def registerAccount():
    if request.method == 'GET':
        return render_template("auth/register_account.html")
    username = request.form.get("username")
    password = request.form.get("password")
    name = request.form.get("name")
    error = ctrl_auth.register(username, password, name)
    if error:
        if error == ctrl_auth.UNKNOWN_ERROR:
            flash('Server Error, Please try again later.',"danger")
        else:
            flash(error, "danger")
            return render_template("auth/register_account.html")
    session["username"] = request.form["username"]
    return redirect(url_for('verification', verificationType='Email'))
    