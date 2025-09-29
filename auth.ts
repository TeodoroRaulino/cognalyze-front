import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      id: "google-idtoken",
      name: "Google ID Token",
      credentials: {
        idToken: { label: "idToken", type: "text" },
      },
      async authorize(creds) {
        const idToken = creds?.idToken;
        if (!idToken) return null;

        const res = await fetch(
          process.env.APP_BACKEND_URL + "/api/auth/google",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          }
        );

        console.log(res);

        if (!res.ok) return null;
        const data: { token: string; email?: string; sub?: string } =
          await res.json();

        return {
          id: data.sub ?? "google-idtoken-user",
          email: data.email,
          accessToken: data.token,
          idToken,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.access_token) token.accessToken = account.access_token;
      if (account?.id_token) token.idToken = account.id_token;

      if (user) {
        const u = user as any;
        if (u.accessToken) token.accessToken = u.accessToken;
        if (u.idToken) token.idToken = u.idToken;
      }
      return token;
    },

    async session({ session, token }) {
      (session as any).accessToken = token.accessToken as string | undefined;
      (session as any).idToken = token.idToken as string | undefined;
      return session;
    },
  },

  pages: { signIn: "/login" },
});
