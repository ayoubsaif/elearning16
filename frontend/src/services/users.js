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