import jwt from 'jsonwebtoken'
import admin from "../models/admin.model.js"
import { plainToHash, HashToPlain } from "../util/password.js";
import asyncHandler from "../util/asyncHandler.js"; 

export const register = asyncHandler (async(req, res) => {
      const { name,email, password } = req.body;
      
      const existemail = await admin.findOne({ email });
      if (existemail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      console.log(name,email,password); 
  
      const hash = await plainToHash(password);
      const newUser = await admin.create({ email,name, password: hash });
      return res.status(201).json({ message: "Registration successful",data:{id:newUser._id,name:newUser.name,email:newUser.email,} });
});

export const isMe = asyncHandler( async (req,res)=>{
  res.status(200).json({success:true,message:"authenticate user",data:{id:req.user._id,name:req.user.name,email:req.user.email}})
});

export const login = asyncHandler(async (req, res) => {
  
    const { email, password } = req.body;
    
    const user = await admin.findOne({ email });
    if (!user) {
      return res.status(404).json({success:false, message: "Email does not exist" });
    }
    
    const isMatch = await HashToPlain(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({success:false, message: "Password does not match" });
    }
    
    const payload = { id: user._id, role_id: user.role_id };
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: "10h"});

    res.cookie("admin", token, { httpOnly: true, maxAge:10 *60 * 60 * 1000 });
    console.log(token, isMatch, user);
    return res.status(200).json({success:true, message: "Login successful",data:{id:user.id,name:user.name,email:user.email} });
});

export const logout = asyncHandler(async (req, res)=>{
  res.clearCookie("admin");
  res.status(200).json({message:"user logedout successfuly"});
})
  
