from app import app

if __name__ == "__main__":
    app.run(debug=True, extra_files=["app/templates/auth/index.html"])