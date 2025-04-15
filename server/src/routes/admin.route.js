import express from 'express';
import { authentication} from "../util/authentication.js";
import {register, login, logout, isMe, updateAdmin, deleteAdmin} from "../controllers/admin.controller.js";

const route = express.Router();

route.post('/register',register)
route.post('/login', login)
route.get("/logout",logout);

route.get("/isMe",authentication,isMe);

route.route("/profile")
     .put(authentication,updateAdmin)
     .delete(authentication,deleteAdmin);

export default route;