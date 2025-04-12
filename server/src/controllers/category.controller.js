import asyncHandler from "../util/asyncHandler.js"; 
import categorys from "../models/category.model.js";

//get category details from database
export const postCategory = asyncHandler(async (req,res,next)=>{
    const data = req.body;
    
    if (!data?.name) 
        return res.status(400).json({success:false,message:"Enter valid details"});

    const Category = new categorys({
        name:data.name,
        color:data?.color || "8B5CF6",
    });

    const newCategory = await Category.save();
    
    if(!newCategory)
        return res.status(400).json({success:false,message:"Enter valid details"});

    res.status(200).json({success:true,message:"category added",data:{newCategory}});
});

export const getCategory = asyncHandler(async (req,res,next)=>{
    const categoryList = await categorys.find();
    
    if(!categoryList)
        return res.status(200).json({success:false,message:"Enter valid category list not found try again"});

    res.status(200).json({success:true,message:"category found",data:{categoryList}});
});
