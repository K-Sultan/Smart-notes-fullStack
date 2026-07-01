import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/"
})
//automatically attach the token to the request headers
API.interceptors.request.use((req) => {
    const storedData = JSON.parse(localStorage.getItem("user"))

    if (storedData && storedData.token) {
        req.headers.Authorization = `Bearer ${storedData.token}`
    }
    return req
})

export default API