import axios from 'axios';

const apiUrl = 'http://localhost:8080/api';

export async function postRequest(path: string, data: any) {
	return await axios.post(`${apiUrl}/${path}`, data);
}

export async function getRequest(path: string) {
	return await axios.get(`${apiUrl}/${path}`);
}

export async function patchRequest(path: string, data: any) {
	return await axios.patch(`${apiUrl}/${path}`, data);
}

export async function deleteRequest(path: string) {
	return await axios.delete(`${apiUrl}/${path}`);
}
