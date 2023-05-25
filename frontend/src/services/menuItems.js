import axios from "axios";

const API_URL = process.env.NEXT_APP_API_HOST || "http://localhost";

export async function getMenuItems(accessToken) {
  try {
    const res = await axios.get(`${API_URL}/api/menu`, { headers: { Authorization: `Bearer ${accessToken}` } } );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
