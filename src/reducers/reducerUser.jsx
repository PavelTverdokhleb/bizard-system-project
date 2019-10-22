import * as types from "../actions/constants";

const INITIAL_STATE = {user_info: {}, user_fetched: null};

export default function(state=INITIAL_STATE, action) {
    switch(action.type) {
        case types.GET_USER_SUCCESS :
            return {...state, user_info : action.payload.data, user_fetched: true};
        case types.UPDATE_USER:
            return {...state, user_info : action.data};
    }
    return state;
}