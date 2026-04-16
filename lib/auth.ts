import GoogleProvider from "next-auth/providers/google";
import { createUser } from "./db";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (user && user.email) {
        try {
          await createUser(user.email, user.name, user.image);
          return true;
        } catch (error) {
          console.error("Error creating user during sign in:", error);
          return false;
        }
      }
      return false;
    },
    async session({ session, token }: any) {
      if (session.user) {
        // In a real app, we'd fetch the DB user ID here
        // For simplicity, we'll store it in the token if possible, 
        // but we'll use email as a link for now or a simple DB lookup
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  }
};
