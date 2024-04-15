import { getInvoices } from '$lib';
import type { PageServerLoad } from './$types';
import bolt11 from 'bolt11';

export const load: PageServerLoad = async () => {
    try {
        const res = await getInvoices();

        return {
            playerOne: {
                id: res.playerOne.id,
                invoice: bolt11.decode(res.playerOne.invoice),
            },
            playerTwo: {
                id: res.playerOne.id,
                invoice: bolt11.decode(res.playerOne.invoice),
            }
        }
    } catch (e) {
        console.error(e);
    }
};
