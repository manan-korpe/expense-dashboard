import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    color:{
        type:String,
        default:"#8B5CF6"
    }
},{
    timestamps:true
});

const categorys = mongoose.model("categorys",categorySchema);

export default categorys;