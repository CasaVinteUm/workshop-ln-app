import express, { Application, Request } from "express";
import { invoicesDb } from "../db";
import { lnd } from "../lnd";
import { Router } from "express";
import { createInvoice, getInvoice, pay } from "lightning";

const router = Router();

const AMOUNT: number = 1000;

router.get('/invoicesForPlayers', async (_req, res) => {
    try {
        console.log('/invoicesForPlayers');

        const invoiceForFirstPlayer = await createInvoice({ lnd, tokens: AMOUNT });
        const playerOneInvoiceHash = invoiceForFirstPlayer.id;
        const playerOnePaymentRequest = invoiceForFirstPlayer.request;

        const invoiceForSecondPlayer = await createInvoice({ lnd, tokens: AMOUNT });
        const playerTwoInvoiceHash = invoiceForSecondPlayer.id;
        const playerTwoPaymentRequest = invoiceForSecondPlayer.request;

        const count = invoicesDb.size;
        const playerOneInvoiceId = count + 1;
        const playerTwoInvoiceId = count + 2;

        invoicesDb.set(playerOneInvoiceId, playerTwoInvoiceHash);
        invoicesDb.set(playerTwoInvoiceId, playerOneInvoiceHash);

        return res.status(200).send({
            playerOne: {
                id: playerOneInvoiceId,
                invoice: playerOnePaymentRequest,
            },
            playerTwo: {
                id: playerTwoInvoiceId,
                invoice: playerTwoPaymentRequest,
            }
        });
    } catch (err) {
        console.error("invoicesForPlayers error: ", err);
        return res.status(500).send({ error: "Server is dumb" });
    }
});

router.get('/invoiceStatus/:id', async (req, res) => {
    console.log("TODO");
});

interface PayInvoiceRequest extends Request { body: { payreq: string } };

router.post('/payInvoice/', async (req: PayInvoiceRequest, res) => {
    console.log("TODO");
});

export const ln = router;

export function routes(app: Application) {
    app.use(express.json());
    app.use('/api', ln);
}
