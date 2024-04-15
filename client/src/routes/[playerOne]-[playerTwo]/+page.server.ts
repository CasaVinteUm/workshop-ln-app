import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    return {
        playerOneName: params.playerOne,
        playerTwoName: params.playerTwo,
    };
};
