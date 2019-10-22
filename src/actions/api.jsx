import axios from "axios";
import * as apiUrl from '../config';

export const api = {
    default:{
        client: axios.create({
            baseURL: apiUrl.API_BASE_URL,
            responseType: 'json'
        })
    },
    second:{
        client: axios.create({
            baseURL: apiUrl.API_SECOND_URL,
            responseType: 'json'
        })
    }
};

export default api;
