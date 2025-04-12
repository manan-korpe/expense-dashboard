import mongoose from "mongoose";

async function databaseConnection(url,name){
    try {
        if(!url || !name)
            throw new Error("url or name not given");
            
        await mongoose.connect(url,{
            dbName:name
        });

    } catch (error) {
        throw new Error(error);
    }
}

export default databaseConnection;