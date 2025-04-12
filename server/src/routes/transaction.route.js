import express from "express";
import { getTransaction, postTransaction } from "../controllers/transaction.controller.js";

const route = express.Router();

route.route("/transaction").get(getTransaction).post(postTransaction);

export default route;