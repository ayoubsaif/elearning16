import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import axios from "axios";

export const authOptions = {
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider == "google" && profile.email_verified == true) {
        const data = {
          firstname: profile?.given_name,
          lastname: profile?.family_name,
          email: profile?.email,
          image: profile?.picture,
          google_id: profile?.sub,
        };
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/auth/google`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            ...data,
          }
        );
        if (res && res.data?.accessToken) {
          user.firstname = res.data?.firstname;
          user.name = res.data?.name;
          user.email = res.data?.email;
          user.image = res.data?.image;
          user.username = res.data?.username;
          user.accessToken = res.data?.accessToken;
          user.role = res.data?.role;
          user.exp = res.data?.exp;
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
        firstname: token.firstname,
        name: token.name,
        email: token.email,
        picture: token.image,
        image: token.image,
        username: token.username,
        role: token.role,
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
          `${process.env.NEXT_PUBLIC_API}/auth/login`,
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
      clientId: process.env.NEXTAUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXTAUTH_GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  ...authOptions,
});
