import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getFirestore } from "@/lib/firebase-admin";
import * as bcrypt from "bcrypt";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { db } from "@/lib/firebase";

export const authOptions: NextAuthOptions = {
  adapter: FirestoreAdapter(db),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const firestore = getFirestore();
        const usersRef = firestore.collection("users");
        const snapshot = await usersRef
          .where("email", "==", credentials.email)
          .limit(1)
          .get();

        if (snapshot.empty) {
          console.log("No user found with that email.");
          return null;
        }

        const userDoc = snapshot.docs[0];
        const user = userDoc.data();

        if (!user.password) {
          console.log("User found, but password is not set.");
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordsMatch) {
          console.log("Password does not match.");
          return null;
        }

        return {
          id: userDoc.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
