import path from 'path'
import express, { Application } from 'express';
import session from 'express-session';
import helmet from 'helmet';
import cors from 'cors';
import passport from 'passport';
import { connect } from './database/db';

import { routeController } from './routes/index';
import { Passport } from './passport/passport';

const PORT = process.env.PORT || 3001;
const APP_SECRET = process.env.APP_SECRET || 'touraxis';
const DB_USER = process.env.DB_USER as string
const DB_PASS = process.env.DB_PASS as string
const DB_NAME = process.env.DB_NAME as string

global.APP_SECRET = process.env.APP_SECRET || 'touraxis';

const app: Application = express()
// Connect app to database
connect(DB_USER, DB_PASS, DB_NAME)
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

// listen on port
app.listen(PORT, () => console.log(`Tour Axis API running on port: ${PORT}`))


