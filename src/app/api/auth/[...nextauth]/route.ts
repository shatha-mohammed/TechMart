import NextAuth from 'next-auth';
import { apiServices } from '@/src/services/api';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "shatha",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your-email@example.com" },
        password: { label: "Password", type: "password", placeholder: "**********" }
      },
      async authorize(credentials, req) {
        const response = await apiServices.login(
          credentials?.email ?? "",
          credentials?.password ?? ""
        );
      console.log("🚀 ~ authorize ~ response:", response)


        if (response.message == "success") {
          const user = {
            id: response.user.email,
            name: response.user.name,
            email: response.user.email,
            role: response.user.role,
            token: response.token,
          };
          return user;
        } else {
          return null;
        }
      }
    })
  ],
  pages:{
    signIn:'/auth/login'
  },
  
  
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.token = user.token;
      token.role = user.role;
    }

    return token;
  },
  async session({ session, token }) {
    if (session) {
      session.user.role = token.role as string;
      session.token = token.token as string;
    }

    return session;
  }
}
})

export { handler as GET, handler as POST };

