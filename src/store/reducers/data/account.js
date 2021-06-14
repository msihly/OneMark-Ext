import * as types from "store/actions/types";

const initState = {};

const account = (state = initState, action) => {
    switch (action.type) {
        case types.ACCOUNT_RETRIEVED: {
            const { info } = action.payload;
            return { ...state, ...info };
        } case types.PROFILE_UPDATED: {
            const { username, email } = action.payload;
            return { ...state, username, email };
        } case types.RESET: {
            return initState;
        } default: {
            return state;
        }
    }
};

export default account;