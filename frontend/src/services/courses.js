import axios from "axios";

const API_URL = process.env.NEXT_APP_API_HOST;
const API_PUBLIC_URL = process.env.NEXT_PUBLIC_API;

export async function getCourses(params) {
  try {
    const res = await axios.get("/api/courses", { params });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCoursesByCategory(category, accessToken, params) {
  try {
    const options = {
      params: {
        ...params,
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const res = await axios.get(`${API_PUBLIC_URL}/api/courses/${category}`, { ...options });
    return res.data;
  } catch (error) {
    console.error(error);
    if (error.response && error.response.status === 404) {
      return error.data;
    }
    throw error;
  }
}

export async function getCoursesFromServer(accessToken, params) {
  try {
    const options = {
      params: {
        ...params,
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const res = await axios.get(`${API_URL}/api/courses`, { ...options });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCourse(slug, accessToken) {
  try {
    const options = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const res = await axios.get(`${API_URL}/api/course/${slug}`, {
      ...options,
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCoursesByCategoryFromServer(
  category,
  accessToken,
  params
) {
  try {
    const options = {
      params: {
        ...params,
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const res = await axios.get(`/api/courses/${category}`, { ...options });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function getCourseContent(slug) {
  return axios.get(`${API_URL}/api/courses/${slug}/content`);
}

export async function createCourse(data, accessToken) {
  try {
    const res = await axios.post(`${API_PUBLIC_URL}/api/course`, data,
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