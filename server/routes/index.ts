import express, { Application } from "express";
import { lnd } from "../lnd";
import { Router } from "express";
import { createInvoice, decodePaymentRequest, getInvoice, getPayment } from "lightning";

const router = Router();

router.get('/decode/:payreq', async (req, res) => {
    try {
        const payreq = req.params.payreq;
        const decoded = await decodePaymentRequest({ lnd, request: payreq });

        const body = {
            description: decoded.description,
            expiresAt: decoded.expires_at,
            amount: decoded.tokens,
        };

        return res.status(200).send(body);
    } catch (err) {
        console.error("Error decoding payreq: ", err);
        return res.status(500).send(err);
    }
});

router.get('/createInvoice/:amount', async (req, res) => {
    try {
        const amount = parseInt(req.params.amount);
        const invoice = await createInvoice({ lnd, tokens: amount });
        const payreq = invoice.request;

        return res.status(200).send({ payreq });
    } catch (err) {
        console.error("Error creating invoice: ", err);
        return res.status(500).send(err);
    }
});

router.get('/getInvoiceStatus/:payreq', async (req, res) => {
    try {
        const payreq = req.params.payreq;
        const invoice = await getInvoice({ lnd, id: payreq });

        const body = {
            confirmed: invoice.is_confirmed,
            confirmedAt: invoice.confirmed_at,
            expiresAt: invoice.expires_at,
            amount: invoice.tokens,
        };

        return res.status(200).send(body);
    } catch (err) {

    }
});

router.post('/payInvoice', async () => { });
router.get('/paymentStatus', async () => { });

export const ln = router;

export function routes(app: Application) {
    app.use(express.json());
    app.use('/api', ln);
}
