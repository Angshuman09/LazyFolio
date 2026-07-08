import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    baseURL: process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_SITE_URL as string: "http://localhost:3000",
})

export const { signIn, signUp, signOut, useSession } = authClient;