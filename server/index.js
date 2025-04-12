import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import databaseConnection from "./src/lib/database.js";
import categoryRoute from "./src/routes/category.route.js";
import transactionRoute from "./src/routes/transaction.route.js";
import adminRoute from "./src/routes/admin.route.js";

const app = express();

//for frontend connection 
app.use(cors());

//middlerware
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1",categoryRoute);   //feture scope
app.use("/api/v1",transactionRoute);
app.use("/api/v1",adminRoute);

try {
    await databaseConnection(process.env.DATABASE_URL, process.env.DATABASE_NAME);  // db connection

    //run server
    app.listen(process.env.PORT || 5000,()=>{   
        console.log(`server run on : http://localhost:${process.env.PORT}`)
    })
} catch (error) {
    console.log(error.message);
}




