<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import type { PageServerData } from "./$types";
    import { getInvoiceStatus } from "$lib";

    export let data: PageServerData;

    let playerOneName: string = "";
    let playerTwoName: string = "";
    let invoicesPaid: boolean = false;

    onMount(() => {
        const interval = setInterval(async () => {
            await checkInvoices();

            if (invoicesPaid) {
                clearInterval(interval);
            }
        }, 1000 * 10);
    });

    async function checkInvoices(): Promise<void> {
        if (!data.playerOne || !data.playerTwo) {
            return;
        }
        const playerOneInvoicePaid = await getInvoiceStatus(data.playerOne.id);
        const playerTwoInvoicePaid = await getInvoiceStatus(data.playerTwo.id);

        invoicesPaid = playerOneInvoicePaid.paid && playerTwoInvoicePaid.paid;

        return;
    }

    function copyToClipboard(payRequest: string | undefined) {
        if (!payRequest) {
            return;
        }

        navigator.clipboard.writeText(payRequest);

        return;
    }

    function submit() {
        if (playerOneName === "" || playerTwoName === "") {
            return;
        }

        if (playerOneName.length < 3 || playerTwoName.length < 3) {
            return;
        }

        if (!invoicesPaid) {
            return;
        }

        goto(`/${playerOneName}-${playerTwoName}`);

        return;
    }

    // $: disabled = false;
    $: disabled = playerOneName === "" || playerTwoName === "" || !invoicesPaid;
</script>

<svelte:head>
    <title>Lightning Pong</title>
    <script
        src="https://unpkg.com/@bitjson/qr-code@1.0.2/dist/qr-code.js"
    ></script>
</svelte:head>

<div class="flex items-center justify-center min-h-screen">
    <div class="flex space-x-10">
        <div>
            <label class="label">
                <span>Jogador 1</span>
                <input
                    class="input"
                    type="text"
                    placeholder="Satoshi"
                    bind:value={playerOneName}
                />
            </label>
            {#if data.playerOne}
                <button
                    on:click={() =>
                        data.playerOne &&
                        copyToClipboard(data.playerOne.invoice.paymentRequest)}
                >
                    <qr-code
                        class="visible max-h-96 max-w-96 dark:invert"
                        contents={`lightning:${data.playerOne.invoice.paymentRequest}`}
                    />
                </button>
            {/if}
        </div>
        <div>
            <label class="label">
                <span>Jogador 2</span>
                <input
                    class="input"
                    type="text"
                    placeholder="Nakamoto"
                    bind:value={playerTwoName}
                />
            </label>
            {#if data.playerTwo}
                <button
                    on:click={() =>
                        data.playerTwo &&
                        copyToClipboard(data.playerTwo.invoice.paymentRequest)}
                >
                    <qr-code
                        class="visible max-h-96 max-w-96 dark:invert"
                        contents={`lightning:${data.playerTwo.invoice.paymentRequest}`}
                    />
                </button>
            {/if}
        </div>
    </div>
    <div class="end-0 flex justify-end pt-4">
        <button on:click={submit} class="variant-filled btn" {disabled}
            >Lesgo</button
        >
    </div>
</div>
