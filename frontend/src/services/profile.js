// user service to get profile data

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API;
const CURRENT_HOST = process.env.NEXTAUTH_URL;

export async function getProfile(accessToken) {
    try {
        const res = await axios.get(`${API_URL}/api/profile`, { headers: { Authorization: `Bearer ${accessToken}` } } );
        return res.data;
    } catch (error) {
        throw error;
    }
}

export async function updateProfile(data, accessToken) {
    try {
        const res = await axios.post(`${API_URL}/api/profile`, data,
            { headers: { 
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${accessToken}`
                } });
        return res.data;
    } catch (error) {
        throw error;
    }
}