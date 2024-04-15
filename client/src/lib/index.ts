import { z } from 'zod';

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
    fetch("http://localhost:5000/api/invoicesForPlayers")
        .then((a) => a.json())
        .then(GetInvoicesResponse.parse);
