import * as types from "store/actions/types";

const menus = (state = [], action) => {
    const nonParents = state.filter(menu => menu.id === action.payload.parent);

    switch (action.type) {
        case types.EXTERNAL_CLICK: {
            return nonParents;
        } case types.MENU_CLOSED: {
            const { id } = action.payload;
            return nonParents.filter(menu => menu.id !== id);
        } case types.MENU_OPENED: {
            const { id, parent } = action.payload;
            return [...nonParents, { id, parent, isOpen: true }];
        } default: {
            return state;
        }
    }
};

export default menus;