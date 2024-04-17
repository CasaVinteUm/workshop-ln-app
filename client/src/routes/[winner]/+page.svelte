<script lang="ts">
    import type { PageServerData } from "./$types";

    export let data: PageServerData;
    let payreq: string = "";

    function pay(): void {
        console.log("TODO");
    }
</script>

<div class="flex items-center justify-center min-h-screen">
    <div class="flex-row space-y-3">
        <p class="h1">{data.winner} wins :P</p>
        <label class="label">
            <span>Invoice</span>
            <input class="input" type="text" bind:value={payreq} />
        </label>
        <button on:click={pay} class="btn variant-filled-primary"
            >Paga ae</button
        >
    </div>
</div>
