import axios from "axios";

export async function addTransactionApi(data){
    try {
        const response = await axios.post("http://localhost:8000/api/v1/transaction",data,{
            withCredentials:true 
        });
        return response?.data?.data?.newTransaction;
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Something want wrong");
    }
}

export async function getTransactionApi(){
    try {
        const response = await axios.get("http://localhost:8000/api/v1/transaction",{
            withCredentials:true 
        });
        const updateData = response?.data?.data?.transactionHistory.map((val)=>{
            return {
                ...val,
                date :String(val?.createdAt).split("T")[0]
            }
        });
        console.log(updateData);
        return updateData;
        
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Something want wrong");
    }
}

export async function putTransactionApi(id,data){
    try {
        const response = await axios.post(`http://localhost:8000/api/v1/transaction/${id}`,data,{
            withCredentials:true 
        });
        return response?.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Something want wrong");
    }
}

export async function deleteTransactionApi(id){
    try {
        const response = await axios.delete(`http://localhost:8000/api/v1/transaction/${id}`,{
            withCredentials:true 
        });
        return response?.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Something want wrong");
    }
}