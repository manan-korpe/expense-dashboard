import axios from "axios";

export async function register(data){
    try {
        const response = await axios.post("http://localhost:8000/api/v1/register",data);
        return response?.data;
    } catch (error) {
        return error?.response?.data?.message || "Something want wrong";
    }
}