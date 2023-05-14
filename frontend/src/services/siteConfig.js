import axios from "axios";
import PropTypes from "prop-types";

const API_URL = process.env.NEXT_APP_API_HOST || "http://localhost";

export async function getSiteConfig() {
  try {
    const response = await axios.get(`${API_URL}/api/site-config`);
    return response.data;
  } catch (error) {
    console.error("Error fetching site config:", error);
    throw error;
  }
}

export const siteConfigPropTypes = PropTypes.shape({
  title: PropTypes.string.isRequired,
  logo_url: PropTypes.string.isRequired,
  home_background: PropTypes.string.isRequired,
});