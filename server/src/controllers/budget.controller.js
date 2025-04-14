import budgets from "../models/budget.model.js";
import asyncHandler from "../util/asyncHandler.js";


export const getBudget = asyncHandler(async (req, res, next)=>{
    const budgetList = await budgets.find({userId:req.user.id});

    if(!budgetList)
        return res.status(400).json({success:false,message:"budget List not found"});

    res.status(200).json({success:false,message:"budget goted",data:{budgetList}});
});

export const postBudget = asyncHandler(async (req, res, next)=>{
    const data = req.body;
    if(!data.category || !data.amount || !data.period)
        return res.status(400).json({success:true,message:"Enter valid details"});

    const dbBudget = new budgets({...data,userId:req.user.id});
    const budget =await dbBudget.save();

    if(!budget)
        return res.status(400).json({success:true,message:"Enter valid details"});

    res.status(200).json({success:true,message:"budget added ",data:{budget}});
});

export const putBudget = asyncHandler(async (req, res, next)=>{
    const id = req.params.id;
    const data = req.body;

    const budget =await budgets.findOneAndUpdate({_id:id,userId:req.user.id},{$set:data},{new:true});

    if(!budget)
        return res.status(400).json({success:true,message:"budget not found"});
    
    res.status(200).json({success:true,message:"budget added ",data:{budget}});
});

export const deleteBudget = asyncHandler(async (req, res, next)=>{
    const id = req.params.id;
    
    const budget =await budgets.findOneAndDelete({_id:id,userId:req.user.id});

    if(!budget)
        return res.status(400).json({success:true,message:"budget not found"});

    res.status(200).json({success:true,message:"budget deleted ",});    
});