import express, { Application } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import cors from 'cors';
import passport from 'passport';
import { connect } from './database/db';
import { routeController } from './routes/index';
import { Passport } from './passport/passport';
import path from 'path';
import { runSchedulledTask } from './scheduller/task-scheduller';

const PORT = process.env.PORT || 3001
const APP_SECRET = process.env.APP_SECRET || 'touraxis'
const filePath = path.join(__dirname + '/scheduller/index')

const app: Application = express()
// Connect app to database
connect()
// Set application middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(
    session({
        secret: APP_SECRET,
        resave: true,
        saveUninitialized: true,
    })
);

// passport middleware
Passport();
app.use(passport.initialize());
app.use(passport.session());

// set application routes
app.use('/api/users', routeController)

// Shedulle task
runSchedulledTask(filePath)

// listen on port
app.listen(PORT, () => console.log(`Tour Axis API running on port: ${PORT}`))

