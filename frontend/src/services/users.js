import axios from "axios";

const API_URL = process.env.NEXT_APP_API_HOST;
const API_PUBLIC_URL = process.env.NEXT_PUBLIC_API;

export async function getUsers(accessToken) {
  try {
    const options = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const res = await axios.get(`${API_PUBLIC_URL}/api/users`, { ...options });
    return res.data;
  } catch (error) {
    console.error(error);
    if (error.response && error.response.status === 404) {
      return error.data;
    }
    throw error;
  }
}

export async function newUser(data) {
  try {
    return await axios.post(`${API_PUBLIC_URL}/auth/register`, data);
  } catch (error) {
    return error?.response?.data;
  }
}

export async function getUserById(id, accessToken) {
  try {
    const options = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const res = await axios.get(`${API_URL}/api/user/${id}`, {
      ...options,
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateUser(id, data, accessToken) {
  try {
    const res = await axios.post(`${API_PUBLIC_URL}/api/user/${id}`, data,
      { headers: { 
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`
      }}
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteUser(id, accessToken) {
  try {
    const res = await axios.delete(`${API_PUBLIC_URL}/api/user/${id}`,
      { headers: { 
        Authorization: `Bearer ${accessToken}`
      }}
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}