import axios from "axios";

const api = axios.create({
    baseURL: 'http://simple-sales-system-api.test/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export default api;