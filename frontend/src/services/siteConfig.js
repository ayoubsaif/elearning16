import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API || "http://localhost";

export async function getSiteConfig() {
  try {
    const response = await axios.get(`${API_URL}/api/siteconfig`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
}

export async function updateSiteConfig(data, accessToken) {
  try {
    console.log(data);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.post(
      `${API_URL}/api/siteconfig`,
      data,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update data");
  }
}
