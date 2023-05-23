import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

const session = () => async (req, res) => {
    const nextAuthSession = await getServerSession(req, res, authOptions);
    if (!nextAuthSession || nextAuthSession.expires * 1000 < Date.now()) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }
    return nextAuthSession;
 };

export default session;