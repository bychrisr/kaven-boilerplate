/**
 * NextAuth Configuration
 * Placeholder - implement based on your auth strategy
 */

import type { NextAuthOptions } from 'next-auth';

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  // TODO: Implement your auth configuration
  providers: [],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
