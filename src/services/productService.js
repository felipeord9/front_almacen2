import { config } from '../config'
const url2 = `${config.apiUrl2}/products`;
const url = `${config.apiUrl}/products`;

function getAllProducts() {
  return fetch(url)
    .then((res) => res.json())
    .then((res) => res.data);
}

function getOneProduct(id) {
  return fetch(`${url}/${id}`)
    .then((res) => res.json())
    .then((res) => res.data);
}

function createProduct(data) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => res.data);
}

function updateProduct(id, data) {
  return fetch(`${url}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => res.data);
}

function deleteProduct(id) {
  return fetch(`${url}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => res.data);
}


function getAllProducts2() {
  return fetch(url2)
    .then(res => res.json())
    .then(res => res.data)
}

function getOneProduct2(id) {
  return fetch(`${url2}/${id}`)
    .then(res => res.json())
    .then(res => res.data)
}

export {
  getAllProducts2,
  getOneProduct2,
  getAllProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
}
