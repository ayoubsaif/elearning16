import axios from "axios";
const API_HOST = process.env.NEXT_APP_API_HOST;

export async function getCategories(accessToken) {
    try {
        const res = await axios.get(`${API_HOST}/api/categories`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return res.data;
    } catch (err) {
        console.log(err);
        throw new Error(err.response.data.message);
    }
}