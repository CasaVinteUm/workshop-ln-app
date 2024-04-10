import express, { Application } from "express";

export function routes(app: Application) {
    app.use(express.json());
}
