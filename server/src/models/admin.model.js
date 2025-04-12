import { Schema, model } from "mongoose";


const Common = {
    type: String,
    required: true,
    unique: true,
    trim: true
}

const adminschema = new Schema({
    name:{
        type:String,
        required:true
    },
    email: Common,
    password: {
        ...Common,
        unique: false
    },
    token: {
        type: String
    },
    role_id: {
        type: Number,
        required: true,
        default: 0,
        enum: [0, 1]
    }

}, {
    timestamps: true
})

const admin = model('Admin', adminschema)
export default admin;