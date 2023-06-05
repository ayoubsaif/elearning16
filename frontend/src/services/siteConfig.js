import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API || "http://localhost";

export async function getSiteConfig() {
  try {
    const response = await axios.get(`${API_URL}/api/site-config`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
}
