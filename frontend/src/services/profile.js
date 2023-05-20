// user service to get profile data

import axios from "axios";

const API_URL = process.env.NEXT_APP_API_HOST || "http://localhost";
const CURRENT_HOST = process.env.NEXTAUTH_URL || "http://localhost:3000";

export async function getProfile(accessToken) {
    try {
        const res = await axios.get(`${API_URL}/api/profile`, { headers: { Authorization: `Bearer ${accessToken}` } } );
        return res.data;
    } catch (error) {
        throw error;
    }
}

export async function updateProfile(data) {
    try {
        const res = await axios.put(`${CURRENT_HOST}/api/profile`, data);
        return res.data;
    } catch (error) {
        throw error;
    }
}