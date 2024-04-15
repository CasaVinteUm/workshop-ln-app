import "dotenv/config";
import { z } from "zod";

export const envSchema = z.object({
    PORT: z.coerce.number(),
    LND_SOCKET: z.string(),
    LND_CERT: z.string(),
    LND_MACAROON: z.string(),
});

function getEnv() {
    const parsedEnv = envSchema.safeParse(process.env);

    if (!parsedEnv.success) {
        console.error(parsedEnv.error.format());
        throw new Error("You've missed something on your env");
    }

    return parsedEnv.data;
}

export const env = getEnv();
