import axios from "axios";
import myConfig from "../config";

const axiosClient = axios.create({
    baseURL: myConfig.BACK_END_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
