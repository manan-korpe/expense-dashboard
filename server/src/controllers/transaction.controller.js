import asyncHandler from "../util/asyncHandler.js"; 
import categorys from "../models/category.model.js";
import transactions from "../models/transaction.model.js";

export const postTransaction = asyncHandler(async (req,res,next)=>{
    const data = req.body;
    
    if(!data.amount || !data.category || !data.type)
        return res.status(400).json({success:false,message:"Enter valid details."});
    
    // const hasCategory = await categorys.findOne({name:data.category}); // future scop

    // if(!hasCategory)
    //     return res.status(400).json({success:false,message:"category not found."});
console.log(req?.user?._id)
    const madeTransaction = new transactions({
        userId:req?.user?._id,
        amount:data.amount,
        category:data.category,
        description:data?.description || "",
        type:data.type,
        createdAt:new Date(data.date.replaceAll("/","-"))
    });
    
    const newTransaction = await  madeTransaction.save();

    if(!newTransaction)
        return res.status(400).json({success:false,message:"Something want wrong try again."});

    res.status(200).json({success:true,message:"Transaction added",data:{newTransaction}});
});

export const getTransaction = asyncHandler(async (req, res, next)=>{
    let transactionHistory = await transactions.find({userId:req?.user?.id || ""});

    if(!transactionHistory)
        return res.status(400).json({success:false,message:"transaction history not found try again"});

    res.status(200).json({success:true,message:"transaction history Found",data:{transactionHistory}});
})

export const putTransaction = asyncHandler(async (req,res,next)=>{
    const data = req.body;
    const transactionId = req.params.id;
    
    if(!transactionId)
        return res.status(400).json({success:false,message:"something wanrt wrong."});

    if(!data.amount || !data.category || !data.type)
        return res.status(400).json({success:false,message:"Enter valid details."});
    
    // const hasCategory = await categorys.findOne({name:data.category}); // future scop

    // if(!hasCategory)
    //     return res.status(400).json({success:false,message:"category not found."});

    const updateTransaction = await transactions.findByIdAndUpdate(transactionId,{
        amount:data.amount,
        category:data.category,
        description:data?.description || "",
        type:data.type
    },{new:true});

    if(!updateTransaction)
        return res.status(400).json({success:false,message:"update failed."});

    res.status(200).json({success:true,message:"Transaction updated",data:{updateTransaction}});
});

export const deletTransaction = asyncHandler( async (req, res, next)=>{
    const id = req.params.id;
    const hasTransactions = await transactions.findOneAndDelete({_id:id,userId:req.user.id});
    
    if(!hasTransactions)
        return res.status(400).json({success:true,message:"transaction delete has been faild"});

    res.status(200).json({success:true,message:"transaction deleted"});
});