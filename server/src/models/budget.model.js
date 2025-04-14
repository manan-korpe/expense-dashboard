import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"admin",
        required:true
    },
    category: {
        type:String,
        required:true,
        trim:true
    },
    amount:{
        type:Number,
        required:true
    },
    period:{
        type:String,
        required:true,
        enum:['monthly','yearly']
    }
  },{ timestamps:true});

const budgets = mongoose.model("budgets",budgetSchema);

export default  budgets;