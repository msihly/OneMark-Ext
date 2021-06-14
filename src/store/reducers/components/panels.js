import * as types from "store/actions/types";

const panels = (state = [], action) => {
    switch (action.type) {
        case types.PANEL_CREATED: {
            return [...state, action.payload];
        } case types.PANEL_DELETED: {
            const { id } = action.payload;
            return state.filter(panel => panel.id !== id);
        } case types.PANEL_UPDATED: {
            const { id, value } = action.payload;
            return state.map(panel => panel.id === id ? { ...panel, value } : panel);
        } default: {
            return state;
        }
    }
};

export default panels;