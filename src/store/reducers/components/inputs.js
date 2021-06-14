import * as types from "store/actions/types";

const inputs = (state = [], action) => {
    switch (action.type) {
        case types.IMAGE_INPUT_CREATED: {
            const { id, value } = action.payload;
            return [...state, { id, value, isImageRemoved: false }];
        } case types.IMAGE_INPUT_UPDATED: {
            const { id, value, isImageRemoved } = action.payload;
            return state.map(input => input.id === id ? {...input, value, isImageRemoved } : input);
        } case types.INPUT_CREATED: {
            const { id, value } = action.payload;
            return [...state, { id, value }];
        } case types.INPUT_UPDATED: {
            const { id, value } = action.payload;
            return state.map(input => input.id === id ? { ...input, value } : input);
        } case types.INPUT_DELETED: {
            return state.filter(input => input.id !== action.payload.id);
        } case types.MULTI_SELECTS_UNSELECTED: {
            return state.map(input => /multi-select/i.test(input.id) ? { ...input, value: false } : input);
        } case types.TAG_ADDED: {
            const { id, value } = action.payload;
            return state.map(input => input.id === id ? { ...input, value: [...input.value, value] } : input);
        } case types.TAG_REMOVED: {
            const { id, value } = action.payload;
            return state.map(input => input.id === id ? { ...input, value: input.value.filter(tag => tag !== value) } : input);
        } default: {
            return state;
        }
    }
};

export default inputs;