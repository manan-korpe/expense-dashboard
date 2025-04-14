import express from 'express';
import { authentication} from "../util/authentication.js";
import {register, login, logout, isMe} from "../controllers/admin.controller.js";

const route = express.Router();

route.post('/register',register)
route.post('/login', login)
route.get("/logout",logout);
route.get("/isMe",authentication,isMe);
export default route;