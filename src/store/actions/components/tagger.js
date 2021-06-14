import * as types from "../types";

export const tagAdded = (id, value) => ({
    type: types.TAG_ADDED,
    payload: { id, value }
});

export const tagRemoved = (id, value) => ({
    type: types.TAG_REMOVED,
    payload: { id, value }
});