import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    // userid:{
    //      type:mongoose.Types.ObjectId,
    //      ref:"users"
    // },
    amount:{
        type:mongoose.Types.Double,
        required:true,
    },
    category:{
        type:mongoose.Types.ObjectId,
        ref:"categorys"
    },
    description:{
        type:String,
        default:""
    },
    type:{
        type:String,
        enum:["expense","income"]
    }
},{ 
    timestamps:true
});

const transactions = mongoose.model("transactions",transactionSchema);

export default transactions;