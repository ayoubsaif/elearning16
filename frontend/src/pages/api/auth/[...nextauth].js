import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import axios from "axios";

export const authOptions = {
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider == "google" && profile.email_verified == true) {
        const data = {
          email: profile?.email,
          firstname: profile?.given_name,
          lastname: profile?.family_name,
          image: profile?.picture,
          google_id: profile?.sub,
        };
        const res = await axios.post(
          `${process.env.NEXT_APP_API_HOST}/auth/google`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            ...data,
          }
        );
        if (res && res.data?.accessToken) {
          user.name = res.data?.name;
          user.email = res.data?.email;
          user.image = res.data?.image;
          user.username = res.data?.username;
          user.accessToken = res.data?.accessToken;
          return true;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.user) {
        user = {...user, ...session.user};
      }
      return { ...token, ...user }
    },
    async session({ session, token }) {
      session.user = {
        name: token.name,
        email: token.email,
        picture: token.image,
        image: token.image,
        username: token.username,
        accessToken: token.accessToken,
      };
      return session;
    },
  },
};

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials, req) {
        const res = await axios.post(
          `${process.env.NEXT_APP_API_HOST}/auth/login`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            email: credentials?.email,
            password: credentials?.password,
          }
        );

        if (res && res.data) {
          return await res.data;
        }
        return {
          status: "error",
          error: "Invalid credentials",
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.NEXT_APP_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_APP_GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  ...authOptions,
});
