import axios from "axios";

const API_URL = process.env.NEXT_APP_API_HOST || "http://localhost";

export async function getCourses(currentPage) {
    try {
        const res = await axios.get(`${API_URL}/api/courses`, { params: { currentPage } });
        return res.data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
}

export function getCourse(slug) {
  return axios.get(`${API_URL}/api/courses/${slug}`);
}

export function getCourseContent(slug) {
  return axios.get(`${API_URL}/api/courses/${slug}/content`);
}
