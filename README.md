## Tour Axis API
This is a simple API that performs basic CRUD for Usrs and Tasks.

# Dependencies
This API uses:
- [Nodev20+] (https://nodejs.org/en) 
- [Typescript] (https://www.typescriptlang.org/)

# Getting Started
To use the API, clone the repo (https://github.com/Clearbryan/touraxis). Once cloned, in the ```root```  folder install packages ```npm install ```

# Environment Variables
There are a few environment variables required to run the API. in the ```root``` folder create a ```.env``` file.
Copy and paste the following env varibales:
```markdown
APP_SECRET=touraxis
PORT=3002
DB_PASS=riYsahtAbMY0b51V
DB_USER=chetekwebrian
DB_NAME=touraxis
```

# Running the API
Once you've pasted the environment variables to the ```.env``` file. The app is ready to start. Run the following command:
```npm run touraxis```. When this command is run, 2 things happen:
1. It starts the application on the specified ```PORT``` (from the environment variables)
2. It spawns a new process that runs a task every 30 minutes and logs the outcome of the task activity to the console

# Usage
You may use any REST client to test the API, however for the purposes of this documentation we can use Postman (https://www.postman.com/)

# API Endpoints
Some API endpoints are protected and the user needs to be logged in to access them. The API has the following endpoints:

1. http://localhost:```{PORT}```/api/users/ - Accepts a ```POST`` request the create a new user. A user needs to have the following: 
```json
{
    "username": "yourusernae",
    "first_name": "your fist name",
    "last_name": "your last name",
    "password": "your password"
}
``` 
1. http://localhost:```{PORT}```/api/users/login - Accepts a ```POST``` request for user login. A login request needs to have the following: 
```json
{
    "username": "yourusernae",
    "password": "your password"
}
``` 
When successful, this endpoint returns a JSON webtoken that can be used to access the other protected endpoints. Example response: 
```json
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjY2Y2YzZjhiNmZlNGNiNDc3YTUyZmQ4MyIsInVzZXJuYW1lIjoiY2xlYXJicnlhbiIsImZpcnN0X25hbWUiOiJCcmlhbiIsImxhc3RfbmFtZSI6IkNoZXRla3dlIiwicGFzc3dvcmQiOiIkMmEkMTAkZ2lDOTQwREFiYUdEY2N4TXRuVU40ZUhaZTZBLzhrdm9nbWlDUU9pdk9xLmtxUTU5b2N5Qi4iLCJfX3YiOjB9LCJpYXQiOjE3MjQ4NTkyMzMsImV4cCI6MTcyNDg2MjgzM30.PUcYnKyD-vcxFMKDck8d_AzbYEX7bef7VIJJRQqafm0"
}
```
Please note the token expires after 60 minutes and you'll need to login again to get a new token if the token has expired.

For every request to a protected endpoint, this token needs to be included it the request headers Authorozation: 
![title](Images/postman.jpg)


