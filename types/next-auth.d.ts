// types/next-auth.d.ts (or anywhere included in tsconfig.json)

import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    userId?: string;
    role?: string;
    // add other custom fields here
  }

  interface User {
    id?: string;   // If you want to access on session.user.id too
    role?: string;
  }

  interface JWT {
    accessToken?: string;
    userId?: string;
    role?: string;
  }
}
