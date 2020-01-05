# Typist
Typing web-game - race against your friends!

# Build Setup
## .env
A .env file is not required to run this project in dev. The project is setup to have fallbacks in the case where a .env is not present. For instance, if variables such as a mongoDB connection string are not present, the app will fire up a local mongo database. However, a .env file can be added to specify particular vairables when running the project in development. Variables used are:

## Startup
``` bash
# server
cd server

# install dependencies
npm install

# start with hot reload at localhost:3000
npm run dev

# client
cd client

# install dependencies
npm install

# start with hot reloat at localhost:8080
npm run serve
```

# Azure Pipeline
The Microsoft Azure CI Pipeline for this project can be found at: https://dev.azure.com/tobybessant/Typist/_build