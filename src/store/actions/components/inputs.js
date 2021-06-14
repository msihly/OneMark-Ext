import * as types from "../types";

export const imageInputCreated = (id, value) => ({
    type: types.IMAGE_INPUT_CREATED,
    payload: { id, value }
});

export const imageInputUpdated = (id, value, isImageRemoved) => ({
    type: types.IMAGE_INPUT_UPDATED,
    payload: { id, value, isImageRemoved }
});

export const inputCreated = (id, value, hasLoseFocus = false) => ({
    type: types.INPUT_CREATED,
    payload: { id, value, hasLoseFocus }
});

export const inputDeleted = (id) => ({
    type: types.INPUT_DELETED,
    payload: { id }
});

export const inputUpdated = (id, value) => ({
    type: types.INPUT_UPDATED,
    payload: { id, value }
});