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