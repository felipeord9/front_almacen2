import { config } from "../config";

const url = `${config.apiUrl}/movements`;

function getAllMovements() {
  return fetch(url)
    .then((res) => res.json())
    .then((res) => res.data);
}

function createMovement(data) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => res);
}

function updateMovement(id, changes) {
  return fetch(`${url}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changes),
  })
    .then((res) => res.json())
    .then((res) => res.data);
}

export { getAllMovements, createMovement, updateMovement };
