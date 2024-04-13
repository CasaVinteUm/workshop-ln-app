import { writable } from 'svelte/store';

export enum AppState {
    GameStart,
    RoundStart,
    Playing,
    GameFinished,

    WatingPayments,
    Winner,
}

export interface Ball {
    x: number,
    y: number,
    speedX: number,
    speedY: number,
};

export interface Player {
    x: number,
    y: number,
    score: number,
}

export const appState = writable<AppState>(AppState.GameStart);
