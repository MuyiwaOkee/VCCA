"server only"
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

type SessionPayload = {
    userid: string,
    expiresAt: Date
}

export const CreateSession = async (userid: string) => {
    const expiresAt = new Date(Date.now() + (1000 * 60 * 60 * 24 *7)) //a week (7 days) after time of creation
    const session = await encrypt({ userid, expiresAt });

    // set as HTTP cookie
    (await cookies()).set("session", session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt
    });
}

export const DeleteSession = async () => {
    (await cookies()).delete("session");
}

export const encrypt = async (payload: SessionPayload) => {
    return new SignJWT(payload)
    .setProtectedHeader({alg: "HS256"})
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export const decrypt = async (session: string | undefined = "") => { 
    try {
        const { payload } = await jwtVerify(session, encodedKey, {algorithms: ['HS256']});

        return payload as SessionPayload;
    } catch (error) {
        console.log("failed to verify session");
    }
}