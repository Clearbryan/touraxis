## Tour Axis API
This is a simple API that performs basic CRUD for Users and Tasks.

### Dependencies
This API uses:
- [Node v20+](https://nodejs.org/en)
- [TypeScript](https://www.typescriptlang.org/)

### Getting Started
To use the API, clone the repo: [https://github.com/Clearbryan/touraxis](https://github.com/Clearbryan/touraxis). Once cloned,  navigate to the root folder ```cd touraxis``` and install the packages using `npm install`.

### Environment Variables
There are a few environment variables required to run the API. In the root folder, create a `.env` file. Copy and paste the following environment variables:

```
APP_SECRET=touraxis
PORT=3000
DB_PASS=riYsahtAbMY0b51V
DB_USER=chetekwebrian
DB_NAME=touraxis
```

### Running the API
Once you've pasted the environment variables into the `.env` file, the app is ready to start. Run the following command:

```bash
npm run touraxis
```

When this command is run, two things happen:
1. It starts the application on the specified `PORT` (from the environment variables).
2. It spawns a new process that runs a task every 30 minutes and logs the outcome of the task activity to the console.

### Usage
You may use any REST client to test the API. However, for the purposes of this documentation, we will use [Postman](https://www.postman.com/). Please note Postman Chrome Extension DOES NOT allow requests over HTTP connections but rather HTTPS. For this reason we need to use the Postman Desktop Client

### API Endpoints
Some API endpoints are protected and the user needs to be logged in to access them. The API has the following endpoints:

1. `http://localhost:{PORT}/api/users/` - Accepts a `POST` request to create a new user. Example request:
   ```json
   {
       "username": "yourusername",
       "first_name": "your first name",
       "last_name": "your last name",
       "password": "your password"
   }
   ``` 
2. `http://localhost:{PORT}/api/users/login` - Accepts a `POST` request for user login. Example request:
   ```json
   {
       "username": "yourusername",
       "password": "your password"
   }
   ``` 
   When successful, this endpoint returns a JSON Web Token that can be used to access the other protected endpoints. Example response:
   ```json
   {
       "success": true,
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjY2Y2YzZjhiNmZlNGNiNDc3YTUyZmQ4MyIsInVzZXJuYW1lIjoiY2xlYXJicnlhbiIsImZpcnN0X25hbWUiOiJCcmlhbiIsImxhc3RfbmFtZSI6IkNoZXRla3dlIiwicGFzc3dvcmQiOiIkMmEkMTAkZ2lDOTQwREFiYUdEY2N4TXRuVU40ZUhaZTZBLzhrdm9nbWlDUU9pdk9xLmtxUTU5b2N5Qi4iLCJfX3YiOjB9LCJpYXQiOjE3MjQ4NjU0OTIsImV4cCI6MTcyNDg2OTA5Mn0.nUcBxvyYeH0YfQ10bX-aYh_J0FduEN-wbAsy4wmxLfU",
       "user_name": "clearbryan",
       "user_id": "66cf3f8b6fe4cb477a52fd83"
   }
   ```
   Please note that the token expires after 60 minutes and you'll need to log in again to get a new token if the token has expired.

   For every request to a protected endpoint, this token needs to be included in the request headers as `Authorization: Bearer <token>`. See screenshot below:

   ![title](Images/postman.jpg)

3. `http://localhost:{PORT}/api/users` - Accepts a `GET` request to list all users.

4. `http://localhost:{PORT}/api/users/{user_id}` - Accepts:
   - `GET` request to retrieve a specific user.
   - `PUT` request to update a user. Example request:
   ```json
   {
       "first_name": "John",
       "last_name": "Doe"
   }
   ```
   - `DELETE` request to delete a user.

5. `http://localhost:{PORT}/api/users/{user_id}/tasks` - Accepts:
   - `POST` request to create a task. Example request:
   ```json
   {
       "name": "Review Code for Security Vulnerabilities",
       "description": "Conduct a security review of the codebase to identify and address potential vulnerabilities.",
       "status": "Pending"
   }
   ```
   By default a task is created with a ```next_execute_date_time``` set to 24 hrs from the time the task was created. Every 30 minutes, the API runs a shedulled task to check for tasks in a Pending state and if found, check if the ```next_execute_date_time``` has passed and update the tasks to Done.
   - `GET` request to list all tasks for a specific user.

6. `http://localhost:{PORT}/api/users/{user_id}/tasks/{task_id}` - Accepts:
   - `GET` request to retrieve a specific task.
   - `PUT` request to update a task. Example request:
   ```json
   {
       "name": "Review Code for Security Vulnerabilities",
       "description": "Conduct a security review of the codebase to identify and address potential vulnerabilities.",
       "status": "Completed"
   }
   ```
   - `DELETE` request to delete a task.

