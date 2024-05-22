import { config } from "../config";

const url = `${config.apiUrl}/positions`;

function getAllPositions() {
  return fetch(url)
    .then((res) => res.json())
    .then((res) => res.data);
}

export {
  getAllPositions
}