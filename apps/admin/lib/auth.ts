/**
 * NextAuth Configuration
 * Placeholder - implement based on your auth strategy
 */

import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  // TODO: Implement your auth configuration
  providers: [],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
};
