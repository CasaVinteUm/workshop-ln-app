import { authenticatedLndGrpc } from "lightning";
import { env } from "../env";

export const { lnd } = authenticatedLndGrpc({
    cert: env.LND_CERT,
    macaroon: env.LND_MACAROON,
    socket: env.LND_SOCKET,
});
