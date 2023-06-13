import axios from "axios";

const API_URL = process.env.NEXT_APP_API_HOST;
const API_PUBLIC_URL = process.env.NEXT_PUBLIC_API;

export async function updateContentProgress(accessToken, contentId, data) {
  try {
    const options = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const res = await axios.post(
      `${API_PUBLIC_URL}/api/content-progress/${contentId}`, data,
      { ...options }
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCourseContentById(id, accessToken) {
  try {
    const options = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const res = await axios.get(`${API_URL}/api/course-content/${id}`, {
      ...options,
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createContent(data, accessToken) {
  try {
    const res = await axios.post(`${API_PUBLIC_URL}/api/course-content`, data,
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

export async function updateContent(id, data, accessToken) {
  try {
    const res = await axios.post(`${API_PUBLIC_URL}/api/course-content/${id}`, data,
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

export async function deleteContent(id, accessToken) {
  try {
    const res = await axios.delete(`${API_PUBLIC_URL}/api/course-content/${id}`,
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