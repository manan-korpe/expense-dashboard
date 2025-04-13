import axios from "axios";

export async function addTransactionApi(data){
    try {
        const response = await axios.post("http://localhost:8000/api/v1/transaction",data);
        return response?.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Something want wrong");
    }
}