import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API;

// Fetch menu data from the backend
export const fetchMenuData = async (accessToken) => {
  try {
    const response = await axios.get(`${API_URL}/api/menu`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }); // Replace '/api/menu' with the appropriate API endpoint
    return response.data;
  } catch (error) {
    console.error("Error fetching menu data:", error);
    return [];
  }
};

// Update menu order in the backend
export const updateMenuOrder = async (menuItems, accessToken) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/menu/order`,
      { menuItems },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    ); // Replace '/api/menu/order' with the appropriate API endpoint
    console.log("Menu order updated:", response.data);
  } catch (error) {
    console.error("Error updating menu order:", error);
  }
};
