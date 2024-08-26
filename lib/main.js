"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv/config');
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const app = (0, express_1.default)();
const APP_SECRET = process.env.APP_SECRET || 'touraxis';
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: APP_SECRET,
    resave: true,
    saveUninitialized: true,
}));
// passport middleware
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// listen on port
app.listen(3000, () => console.log(`Tour Axis API running on port: 3000`));
