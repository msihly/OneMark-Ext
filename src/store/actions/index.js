import * as types from "./types";

export * from "./components";
export * from "./data";

/* ------------------------------- RESET STATE ------------------------------ */
export const stateReset = () => ({
    type: types.RESET,
    payload: { }
});