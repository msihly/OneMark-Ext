import * as types from "store/actions/types";

const modals = (state = [], action) => {
    switch (action.type) {
        case types.MODAL_CLOSED: {
            const { id } = action.payload;
            return state.filter(modal => modal.id !== id);
        } case types.MODAL_OPENED: {
            const { id } = action.payload;
            return [...state, { id, isOpen: true }];
        } default: {
            return state;
        }
    }
};

export default modals;