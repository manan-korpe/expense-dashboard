import express from "express";
import { deletTransaction, getTransaction, postTransaction, putTransaction } from "../controllers/transaction.controller.js";
import { authentication} from "../util/authentication.js";

const route = express.Router();

route.route("/transaction")
    .get(authentication,getTransaction)
    .post(authentication,postTransaction)

route.route("/transaction/:id")
    .put(authentication,putTransaction)
    .delete(authentication,deletTransaction);

export default route;