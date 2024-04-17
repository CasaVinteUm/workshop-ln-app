import express, { Application, Request } from "express";
import { invoicesDb } from "../db";
import { lnd } from "../lnd";
import { Router } from "express";
import { createInvoice, getInvoice, pay } from "lightning";

const router = Router();

const AMOUNT: number = 1000;

router.get('/invoicesForPlayers', async (_req, res) => {
    console.log("TODO");
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
