import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId:{
         type:mongoose.Types.ObjectId,
         ref:"amin"
    },
    amount:{
        type:mongoose.Types.Double,
        required:true,
    },
    // category:{
    //     type:mongoose.Types.ObjectId,
    //     ref:"categorys"
    // },
    category:{
        type:String,
        ref:"other"
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