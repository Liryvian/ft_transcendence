import axios from 'axios';

export async function postRequest(path: string, data: any) {

    console.log("doing a post request on: ", path)
    return await axios.post(`http://localhost:8080/api/${path}`, data);
}

export async function getRequest(path: string) {
    console.log("doing a get request on: ", path)
    return await axios.get(`http://localhost:8080/api/${path}`);
}

export async function patchRequest(path: string , data: any) {
    return await axios.patch(`http://localhost:8080/api/${path}`, data);
}

export async function deleteRequest(path: string) {
    return await axios.delete(`http://localhost:8080/api/${path}`);
}