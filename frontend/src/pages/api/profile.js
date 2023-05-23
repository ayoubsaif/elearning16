import axios from "axios";

const API_URL = process.env.NEXT_APP_API_HOST;

import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const accessToken = session?.user?.accessToken;
  const { method, url, headers, data } = req;
  console.log("profile api", req);
  try {
    const response = await axios({
      method,
      url: `${API_URL}/api/profile/v2`,
      headers: { ...headers, Authorization: `Bearer ${accessToken}` },
      data,
    });

    // Forward the response from the backend API to the frontend
    res.status(response.status).json(response.data);
  } catch (error) {
    console.log(error);
    res.status(error.response.status).json(error.response.data);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
