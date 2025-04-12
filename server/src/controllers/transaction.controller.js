import asyncHandler from "../util/asyncHandler.js"; 
import categorys from "../models/category.model.js";
import transactions from "../models/transaction.model.js";

export const postTransaction = asyncHandler(async (req,res,next)=>{
    const data = req.body;
    
    if(!data.amount || !data.category || !data.type)
        return res.status(400).json({success:false,message:"Enter valid details."});
    
    const hasCategory = await categorys.findOne({name:data.category});

    if(!hasCategory)
        return res.status(400).json({success:false,message:"category not found."});

    const madeTransaction = new transactions({
        amount:data.amount,
        category:hasCategory,
        description:data?.description || "",
        type:data.type
    });
    const newTransaction = await  madeTransaction.save();

    if(!newTransaction)
        return res.status(400).json({success:false,message:"something want wrong try again."});

    res.status(200).json({success:true,message:"transaction added",data:{newTransaction}});
});

export const getTransaction = asyncHandler(async (req, res, next)=>{
    const transactionHistory = await transactions.find();

    if(!transactionHistory)
        return res.status(400).json({success:false,message:"transaction history not found try again"});

    res.status(200).json({success:true,message:"transaction history Found",data:{transactionHistory}});
})