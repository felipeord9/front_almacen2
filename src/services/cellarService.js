import { config } from "../config";

const url = `${config.apiUrl}/cellars`

function getAllCellars() {
    return fetch(`${url}/total`)
    .then((res) => res.json())
    .then((res) => res.data);
}

function getAllCellarsExistence() {
    return fetch(`${url}/existence`)
    .then((res) => res.json())
    .then((res) => res.data);
}

function getCellarExistence(id) {
    return fetch(`${url}/existence/${id}`)
    .then((res) => res.json())
    .then((res) => res.data);
}

export {
    getAllCellars,
    getAllCellarsExistence,
    getCellarExistence
}