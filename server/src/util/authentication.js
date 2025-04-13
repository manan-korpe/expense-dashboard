import asyncHandler from "./asyncHandler.js";
import jwt from "jsonwebtoken";
import adminDB from "../models/admin.model.js";

export const authentication = asyncHandler(async (req, res, next) => {
  const { admin } = req.cookies;
  
  if (!admin) {
    return res.status(400).json({success:false,message:"login to access this resource"})
  }

  const isVerify = jwt.verify(admin, process.env.ACCESS_TOKEN_KEY);

  if(!isVerify)
    return res.status(400).json({success:false,message:"login to access this resource"})
  
  const isFindUser = await adminDB.findById(isVerify.id);

  if(!isFindUser)
    return res.status(400).json({success:false,message:"user not found"})

  req.user = isFindUser;
  next();
});
