import * as types from "../types";

export const externalClick = () => ({
    type: types.EXTERNAL_CLICK,
    payload: {}
});

export const menuClosed = (id, parent = "") => ({
    type: types.MENU_CLOSED,
    payload: { id, parent }
});

export const menuOpened = (id, parent = "") => ({
    type: types.MENU_OPENED,
    payload: { id, parent }
});