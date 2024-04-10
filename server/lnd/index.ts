import { authenticatedLndGrpc } from "lightning";

export const { lnd } = authenticatedLndGrpc({
    cert: "",
    macaroon: "",
    socket: "",
});
