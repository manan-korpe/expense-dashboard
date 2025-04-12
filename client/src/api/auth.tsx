import axios from "axios";

export async function registerApi(data){
    try {
        const response = await axios.post("http://localhost:8000/api/v1/register",data);
        return response?.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Something want wrong");
    }
}

export async function loginApi(data){
    try {
        const response = await axios.post("http://localhost:8000/api/v1/login",data);
        return response?.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Something want wrong");
    }
}