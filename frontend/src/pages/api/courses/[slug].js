import axios from "axios";
const API_URL = process.env.NEXT_APP_API_HOST;

import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  const category = req.query.slug;
  const session = await getServerSession(req, res, authOptions);
  const accessToken = session?.user?.accessToken;
  if (req.method === "GET") {
    let options = {
      params: {
        ...req.query,
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const response = await axios.get(`${API_URL}/api/courses/${category}`, {
      ...options,
    });
    res.status(200).json(response.data);
  } else {
    res.status(405).json({ message: "We only support PUT" });
  }
}
