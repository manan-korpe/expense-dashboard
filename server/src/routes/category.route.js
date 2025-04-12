import express from "express";
import { postCategory,getCategory } from "../controllers/category.controller.js";

const route = express.Router();

route.route("/category").get(getCategory).post(postCategory);

export default route;