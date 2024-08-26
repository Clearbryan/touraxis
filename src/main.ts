import 'dotenv/config';
import express, { Application } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import cors from 'cors';
import passport from 'passport';
import { connect } from './database/db'

import { userController } from './routes/users'
import { taskController } from './routes/tasks';


const app: Application = express()
connect()

const PORT = process.env.PORT || 3001;
const APP_SECRET = process.env.APP_SECRET || 'touraxis';

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
app.use(passport.initialize());
app.use(passport.session());

// set application routes
app.use('/api/users', userController)
app.use('/api/tasks', taskController)

// listen on port
app.listen(PORT, () => console.log(`Tour Axis API running on port: ${PORT}`))


