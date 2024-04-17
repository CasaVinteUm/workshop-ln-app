<script lang="ts">
    import { payInvoice } from "$lib";
    import type { PageServerData } from "./$types";

    export let data: PageServerData;

    let id: number | undefined = undefined;
    let payreq: string = "";

    function pay(): void {
        if (payreq === "") {
            return;
        }

        payInvoice(payreq)
            .then((payment) => {
                id = payment.id;
            })
            .catch((e) => {
                console.error("error paying invoice", e);
            });
    }
</script>

<div class="flex items-center justify-center min-h-screen">
    <p class="h1">{data.winner} wins :P</p>
    <label class="label">
        <span>Invoice</span>
        <input class="input" type="text" bind:value={payreq} />
    </label>
    <button on:click={pay}>Paga ae</button>
</div>
