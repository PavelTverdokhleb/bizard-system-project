import * as types from "../actions/constants";

const INITIAL_STATE = {
    workers_list: {},
    worker_detail: {},
    workers_error: []
};

export default function(state=INITIAL_STATE, action) {
    switch(action.type) {
        case types.GET_WORKERS_SUCCESS :
            return {...state, workers_list : action.payload.data};
        case types.GET_WORKER_DETAIL_SUCCESS :
            return {...state, worker_detail : action.payload.data};
        case types.GET_WORKERS_FAIL :
            return {...state, workers_error : action.error.response.data};
        case types.GET_WORKER_DETAIL_FAIL :
            return {...state, workers_error : action.error.response.data};
    }
    return state;
}