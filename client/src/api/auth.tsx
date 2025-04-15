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
        const response = await axios.post("http://localhost:8000/api/v1/login",data,{
            withCredentials:true 
        });
        console.log(response );
        return response.data.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Something want wrong");
    }
}

export async function logoutApi(){
    try {
        const response = await axios.get("http://localhost:8000/api/v1/logout",{
            withCredentials:true 
        });
        return response.data.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Something want wrong");
    }
}

export async function isMeApi(){
    try {
        const response = await axios.get("http://localhost:8000/api/v1/isMe",{
            withCredentials:true 
        });
        return response.data.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Something want wrong");
    }
}

export async function updateAdminApi(data){
    try {
        const response = await axios.put("http://localhost:8000/api/v1/profile",data,{
            withCredentials:true 
        });
        return response?.data?.data?.profile;
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Something want wrong");
    }
} 

export async function deleteAdminApi(){
    try {
        const response = await axios.delete("http://localhost:8000/api/v1/profile",{
            withCredentials:true 
        });
        return response?.data?.data?.message;
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Something want wrong");
    }
} 