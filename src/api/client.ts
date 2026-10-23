// this file is used so that we can easily change the baseURL of the API in one place if needed.

import axios from 'axios';

const client = axios.create({
    baseURL: "https://dummyjson.com",
    headers: {
        "Content-Type": "application/json"
    }

})

export default client;
