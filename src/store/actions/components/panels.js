import * as types from "../types";

export const panelCreated = (id, value) => ({
    type: types.PANEL_CREATED,
    payload: { id, value }
});

export const panelDeleted = (id) => ({
    type: types.PANEL_DELETED,
    payload: { id }
});

export const panelUpdated = (id, value) => ({
    type: types.PANEL_UPDATED,
    payload: { id, value }
});