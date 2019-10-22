import * as types from "../actions/constants";

const INITIAL_STATE = {error:[]};

export default function(state=INITIAL_STATE, action) {
    switch(action.type) {
        case types.POST_SIGN_IN_FAIL :
            return {...state, error : action.error.response.data};
        case types.POST_CONFIRM_FAIL :
            return {...state, error : action.error.response.data};
        case types.POST_ACTIVATION_FAIL :
            return {...state, error : action.error.response.data};
        case types.POST_RESEND_FAIL :
            return {...state, error : action.error.response.data};
        case types.POST_RECOVER_FIRST_STEP_FAIL :
            return {...state, error : action.error.response.data};
        case types.POST_RECOVER_THIRD_STEP_FAIL :
            return {...state, error : action.error.response.data};
    }
    return state;
}