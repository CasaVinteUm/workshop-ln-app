<script lang="ts">
    import { goto } from "$app/navigation";
    import type { PageServerData } from "./$types";

    export let data: PageServerData;

    let playerOneName: string = "";
    let playerTwoName: string = "";

    console.log(data.playerOne!.invoice);

    function submit() {
        if (playerOneName === "" || playerTwoName === "") {
            return;
        }

        if (playerOneName.length < 3 || playerTwoName.length < 3) {
            return;
        }

        goto(`/${playerOneName}-${playerTwoName}`);
    }
</script>

<svelte:head>
    <title>Lightning Pong</title>
    <script
        src="https://unpkg.com/@bitjson/qr-code@1.0.2/dist/qr-code.js"
    ></script>
</svelte:head>

<div class="flex items-center justify-center min-h-screen">
    <form on:submit|preventDefault={submit} class="pt-4">
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
                    <qr-code
                        class="visible max-h-96 max-w-96 dark:invert"
                        contents={`lightning:${data.playerOne.invoice.paymentRequest}`}
                    />
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
                <qr-code
                    class="visible max-h-96 max-w-96 dark:invert"
                    contents={`lightning:${data.playerTwo.invoice.paymentRequest}`}
                />
            </div>
        </div>
        <div class="end-0 flex justify-end pt-4">
            <button type="submit" class="variant-filled btn">Lesgo</button>
        </div>
    </form>
</div>
