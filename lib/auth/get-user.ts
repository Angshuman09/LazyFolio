import { authClient } from "./auth-client";

export async function getUser() {
    try {
        const {data:session} = await authClient.getSession();
        if (!session || !session.user) {
        return null;
        }
        return session.user;
    } catch (error) {
        console.error("Error fetching user session:", error);
        return null;
    }
}