<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import type { PageServerData } from "./$types";

    export let data: PageServerData;

    let playerOneName: string = "";
    let playerTwoName: string = "";
    let invoicesPaid: boolean = false;

    onMount(() => {
        console.log("TODO");
    });

    async function checkInvoices(): Promise<void> {
        console.log("TODO");
    }

    function copyToClipboard(payRequest: string | undefined) {
        if (!payRequest) {
            return;
        }

        navigator.clipboard.writeText(payRequest);

        return;
    }

    function submit() {
        console.log("TODO");
    }

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
