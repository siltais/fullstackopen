import axios from "axios";
const baseUrl = "/api/comments";

let token = null;
const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};
const getAll = async () => {
  const request = await axios.get(baseUrl, {
    headers: { Authorization: token },
  });
  return request.data;
};

const createNew = async (newObject) => {
  const request = await axios.post(baseUrl, newObject, {
    headers: { Authorization: token },
  });
  return request.data;
};

const removeComment = async (id) => {
  const request = await axios.delete(`${baseUrl}/${id}`, {
    headers: { Authorization: token },
  });
  return request.data;
};

export default { getAll, setToken, createNew, removeComment };
