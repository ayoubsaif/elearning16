import axios from "axios";

const API_URL = process.env.NEXT_APP_API_HOST || "http://localhost";

export async function getCourses(accessToken, params) {
  try {
    let options = {
      params: {
        ...params,
      },
    };
    const res = await axios.get(`${API_URL}/api/courses`, {...options});
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function getCourse(slug) {
  return axios.get(`${API_URL}/api/courses/${slug}`);
}

export function getCourseContent(slug) {
  return axios.get(`${API_URL}/api/courses/${slug}/content`);
}
