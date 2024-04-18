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
    try {
        console.log('invoiceStatus');

        const { id } = req.params;
        const idAsInt = parseInt(id);

        const invoiceHash = invoicesDb.get(idAsInt);

        if (!invoiceHash) {
            return res.status(404).send({ error: "Invoice not found" });
        }

        const status = await getInvoice({ lnd, id: invoiceHash });

        return res.status(200).send({ paid: status.is_confirmed });
    } catch (err) {
        console.error("invoiceStatus error: ", err);
        return res.status(500).send({ error: "Server is dumb" });
    }
});

interface PayInvoiceRequest extends Request { body: { payreq: string } };

router.post('/payInvoice/', async (req: PayInvoiceRequest, res) => {
    try {
        const payreq = req.body.payreq;

        const outcome = await pay({ lnd, request: payreq });

        return res.status(200).send({
            success: outcome.is_confirmed,
        });
    } catch (error) {
        console.error("payInvoice error: ", error);
        return res.status(500).send({ error: "Server is dumb" });
    }
});

export const ln = router;

export function routes(app: Application) {
    app.use(express.json());
    app.use('/api', ln);
}
