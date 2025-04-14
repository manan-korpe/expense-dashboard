import Axios from "axios";

const axios = Axios.create({
    baseURL:"http://localhost:8000/api/v1",
    withCredentials:true
});

export async function getBudgetApi() {
    try {
        const response = await axios.get("/budget");
        return response?.data?.data?.budgetList;
    } catch (error) {
        throw new Error(error?.response?.data?.message || "something want wrong");
    }
}

export async function postBudgetApi(data) {
    try {
        const response = await axios.post("/budget",data);
        return response?.data?.data?.budget;
    } catch (error) {
        throw new Error(error?.response?.data?.message || "something want wrong");
    }
}

export async function putBudgetApi(id,data) {
    try {
        const response = await axios.put(`/budget/${id}`,data);
        return response?.data?.data?.budget;
    } catch (error) {
        throw new Error(error?.response?.data?.message || "something want wrong");
    }
}

export async function deleteBudgetApi(id) {
    try {
        const response = await axios.put(`/budget/${id}`);
        return response?.data?.data?.message;
    } catch (error) {
        throw new Error(error?.response?.data?.message || "something want wrong");
    }
}