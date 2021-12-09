# Passwordless Python Sample App

This is Sample app for Passwordless authentication, which is used to demonstrate how to use passwordless authentication. 


- Create free account on https://home.passwordless.com.au

- Create a web app

- You will get client_id and baseURL

- Use CLIENT_ID and BASE_URL to do passwordless authentication.

## Installation

1. Clone Project

```bash
  git clone https://github.com/BB-Passwordless/Passwordless-Sample-App.git
  cd passwordless-python-sample-app
```
    
2. Install packages with npm or yarn

```bash

  pip install -r requirements.txt
  
```

3. Replace CLIENT_ID and BASE_URL with your own from /web/static/js/script.js

4. Run project by following command

```bash
python3 ./App.py
```


5. Project will start running on

```bash
http://localhost:8080
```


## Running localhost on Remote devices (for development only)

1. go to https://ngrok.com and login or create account 

2. Download ngrok based on your OS 

3. unzip ngrok and follow ngrok documentation

4. Run ngrok with command 

```bash
  ./ngrok http 8080
```
5. You will get a https url, copy it

6. Open Passwordless Dasboard and Edit your app website url, and you are done. Now you can use appless and inApp feature to login from remote devices in development.

## Authors

- [@Nitesh Singh](https://www.github.com/Nitesh-BB)


## Feedback

If you have any feedback, please reach out to us at help@passwordless.com.au


## Features

- Authentication on same Platform
- Remote Authentication without App
- Remote Based Authentication with App - Android and ios
- Push based Authentication