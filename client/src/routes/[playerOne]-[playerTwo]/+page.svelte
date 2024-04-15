<script lang="ts">
    import { onMount } from "svelte";
    import type { PageServerData } from "./$types";

    export let data: PageServerData;

    let canvas: HTMLCanvasElement | undefined = undefined;
    let ctx: CanvasRenderingContext2D | null = null;

    const framesPerSecond: number = 30;
    const canvasHeight: number = 600;
    const canvasWidth: number = 1000;
    const paddleHeight: number = 100;
    const paddleWidth: number = 10;
    const gap: number = 2;

    let countdown: number = 2 * framesPerSecond;
    let round: number = 0;
    let rally: number = 0;

    const initialBallX: number = canvasWidth / 2;
    const initialBallY: number = canvasHeight / 2;
    const initialBallSpeedX: number = 10;
    const initialBallSpeedY: number = 4;

    interface Ball {
        x: number;
        y: number;
        speedX: number;
        speedY: number;
    }

    interface Player {
        name: string;
        x: number;
        y: number;
        score: number;
    }

    let ball: Ball = {
        x: initialBallX,
        y: initialBallY,
        speedX: initialBallSpeedX * (Math.random() < 0.5 ? -1 : 1),
        speedY: initialBallSpeedY * (Math.random() < 0.5 ? -1 : 1),
    };

    const initialPlayerY: number = (canvasHeight - paddleHeight) / 2;
    let playerOne: Player = { name: "", x: gap, y: initialPlayerY, score: 0 };
    let playerTwo: Player = {
        name: "",
        x: canvasWidth - paddleWidth - gap,
        y: initialPlayerY,
        score: 0,
    };

    onMount(() => {
        if (data.playerOneName && data.playerTwoName) {
            playerOne.name = data.playerOneName;
            playerTwo.name = data.playerTwoName;
        }

        canvas = document.querySelector("#gameCanvas") as HTMLCanvasElement;
        ctx = canvas.getContext("2d");

        setInterval(() => {
            if (canvas === undefined || ctx === null) {
                return;
            }

            state = tick(state);
            draw();
        }, 1000 / framesPerSecond);

        window.addEventListener("keydown", handleKeyPress);
    });

    enum State {
        GameStart,
        RoundStart,
        Playing,
        GameFinished,
    }

    let state: State = State.GameStart;

    function tick(currState: State): State {
        switch (currState) {
            case State.GameStart:
                if (countdown >= 0) {
                    countdown -= 1;
                    return State.GameStart;
                }

                round = 0;
                rally = 0;
                playerOne.score = 0;
                playerTwo.score = 0;

                return State.RoundStart;
            case State.RoundStart:
                ball.x = initialBallX;
                ball.y = initialBallY;
                ball.speedX =
                    initialBallSpeedX * (Math.random() < 0.5 ? -1 : 1);
                ball.speedY =
                    initialBallSpeedY * (Math.random() < 0.5 ? -1 : 1);

                playerOne.y = initialPlayerY;
                playerTwo.y = initialPlayerY;

                rally = 0;
                round += 1;

                return State.Playing;
            case State.Playing:
                const outcome = play();

                switch (outcome) {
                    case PlayOutcome.Scored:
                        if (playerOne.score >= 5 || playerTwo.score >= 5) {
                            return State.GameFinished;
                        } else {
                            return State.RoundStart;
                        }
                    case PlayOutcome.Hit:
                        if (rally > 0 && rally % 2 === 0) {
                            ball.speedX *= 1.1;
                            ball.speedY *= 1.1;
                        }

                        return State.Playing;
                    case PlayOutcome.Noop:
                        return State.Playing;
                }
            case State.GameFinished:
                countdown = 3 * framesPerSecond;
                return State.GameStart;
        }
    }

    enum PlayOutcome {
        Scored,
        Noop,
        Hit,
    }

    function play(): PlayOutcome {
        ball.x += ball.speedX;
        ball.y += ball.speedY;

        if (ball.y < 0 || ball.y > canvas!.height) {
            ball.speedY = -ball.speedY;
        }

        if (
            ball.x <= playerOne.x + paddleWidth &&
            ball.y > playerOne.y &&
            ball.y < playerOne.y + paddleHeight
        ) {
            rally += 1;
            ball.speedX = -ball.speedX;
            return PlayOutcome.Hit;
        } else if (
            ball.x >= playerTwo.x &&
            ball.y > playerTwo.y &&
            ball.y < playerTwo.y + paddleHeight
        ) {
            rally += 1;
            ball.speedX = -ball.speedX;
            return PlayOutcome.Hit;
        } else if (ball.x < gap + paddleWidth) {
            playerTwo.score += 1;
            return PlayOutcome.Scored;
        } else if (ball.x > canvasWidth - gap - paddleWidth) {
            playerOne.score += 1;
            return PlayOutcome.Scored;
        } else {
            return PlayOutcome.Noop;
        }
    }

    function handleKeyPress(event: KeyboardEvent): void {
        const upperEdge: number = canvasHeight - paddleHeight;
        const step = Math.floor(paddleHeight / 4);

        switch (event.key) {
            case "f":
                playerOne.y = Math.min(playerOne.y + step, upperEdge);
                break;
            case "d":
                playerOne.y = Math.max(playerOne.y - step, 0);
                break;
            case "j":
                playerTwo.y = Math.min(playerTwo.y + step, upperEdge);
                break;
            case "k":
                playerTwo.y = Math.max(playerTwo.y - step, 0);
                break;
        }
    }

    function draw(): void {
        if (canvas === undefined || ctx === null) {
            return;
        }

        ctx.fillStyle = "rgb(62, 68, 82)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgb(229, 192, 123)";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.fillStyle = "rgb(152, 195, 121)";
        ctx.fillRect(playerOne.x, playerOne.y, paddleWidth, paddleHeight);
        ctx.fillRect(playerTwo.x, playerTwo.y, paddleWidth, paddleHeight);
    }
</script>

<div class="flex items-center justify-center min-h-screen">
    <div class="flex-row">
        <div class="flex justify-center">
            <p>
                {playerOne.name}: {playerOne.score}, {playerTwo.name}: {playerTwo.score}
            </p>
            <p class="ml-3">{`Rally: ${rally}`}</p>
        </div>
        <canvas id="gameCanvas" width={canvasWidth} height={canvasHeight} />
    </div>
</div>
