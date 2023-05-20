
import axios from 'axios';
const API_URL = process.env.NEXT_APP_API_HOST || "http://localhost";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);
    const accessToken = session?.user?.accessToken;
    const { body } = req;
    if (req.method === 'PUT') {
        try {
            const response = await axios.put(`${API_URL}/api/profile`, body, { headers: { Authorization: `Bearer ${accessToken}` } } );
            res.status(200).json(response.data); ;
        } catch (error) {
            console.error("✨ LINE 17 profile API: \n\n\n", error);
            res.status(401).json(error);
        }
    } else {
      res.status(405).json({ message: 'We only support PUT' });
    }
  }