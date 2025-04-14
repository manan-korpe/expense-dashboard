import express from "express";
import {getBudget, postBudget, putBudget, deleteBudget} from "../controllers/budget.controller.js";
import { authentication } from "../util/authentication.js";

const route = express.Router();

route.route("/budget")
    .get(authentication, getBudget)
    .post(authentication, postBudget);

route.route("/budget/:id")
    .put(authentication, putBudget)
    .delete(authentication, deleteBudget);

export default route;