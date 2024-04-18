import { z } from 'zod';

const API_ENDPOINT: string = "http://localhost:8000";

type GetInvoicesResponse = z.infer<typeof GetInvoicesResponse>;

const GetInvoicesResponse = z.object({
    playerOne: z.object({
        id: z.number(),
        invoice: z.string(),
    }),
    playerTwo: z.object({
        id: z.number(),
        invoice: z.string(),
    }),
});

export const getInvoices = async (): Promise<GetInvoicesResponse> =>
    fetch(`${API_ENDPOINT}/api/invoicesForPlayers`)
        .then((a) => a.json())
        .then(GetInvoicesResponse.parse);

type GetInvoiceStatusResponse = z.infer<typeof GetInvoiceStatusResponse>;

const GetInvoiceStatusResponse = z.object({
    paid: z.boolean(),
})

export const getInvoiceStatus = async (id: number): Promise<GetInvoiceStatusResponse> =>
    fetch(`${API_ENDPOINT}/api/invoiceStatus/${id}`)
        .then((a) => a.json())
        .then(GetInvoiceStatusResponse.parse)

type PayInvoiceResponse = z.infer<typeof PayInvoiceResponse>;
const PayInvoiceResponse = z.object({
    id: z.number(),
})

export const payInvoice = async (payreq: string): Promise<PayInvoiceResponse> =>
    fetch(`${API_ENDPOINT}/api/payInvoice`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            payreq
        })
    })
        .then(response => response.json())
        .then(PayInvoiceResponse.parse)
