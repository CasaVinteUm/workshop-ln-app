<script lang="ts">
    import { goto } from "$app/navigation";

    let playerOneName: string = "";
    let playerTwoName: string = "";

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
</svelte:head>

<form on:submit|preventDefault={submit} class="pt-4">
    <label class="label">
        <span>Jogador 1</span>
        <input
            class="input"
            type="text"
            placeholder="Satoshi"
            bind:value={playerOneName}
        />
    </label>
    <label class="label">
        <span>Jogador 2</span>
        <input
            class="input"
            type="text"
            placeholder="Nakamoto"
            bind:value={playerTwoName}
        />
    </label>
    <div class="end-0 flex justify-end pt-4">
        <button type="submit" class="variant-filled btn">Lesgo</button>
    </div>
</form>
