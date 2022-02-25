from flask import Flask, render_template
import requests
import json
app = Flask(__name__,static_url_path='', 
            static_folder='web/static',
            template_folder='web/templates')

@app.route("/")
def login():
    return render_template("login.html",title="Login")

@app.route("/register")
def register():
    return render_template("login.html",title="Register")

@app.route("/login-success")
def loginSuccess():
    return render_template("success.html",title="Login Success")


@app.route("/register-success")
def registerSuccess():
    return render_template("success.html",title="Register Success")


@app.route("/approveAuthentication/<accessToken>")
def loginToken(accessToken):
    print(accessToken)
    my_headers = {'Content-Type' : 'application/json'}

    try:
        response = requests.get("https://api.passwordless4u.com/v1/verifyToken/"+accessToken, headers=my_headers)
        data = response.json()
        print(data)
        if 'errorCode' in data and data['errorCode'] == -1:
            return render_template("error.html",title="Error",)
        if data['type'] ==2:
           
            return render_template("Details.html",title="Approve Login",data=data)
        else:
            
            return render_template("Details.html",title="Approve Register",data=data)
    
    except Exception as e:
        print("error",e)
        return render_template("error.html",title="Error",)
   

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8085)


