import * as types from "../actions/constants";

const INITIAL_STATE = {
    clients_list: [],
    client_detail: {},
    clients_error:[],
    client_inner_error: [],
    clients_action_error:[]
};

export default function(state=INITIAL_STATE, action) {
    switch(action.type) {
        case types.GET_CLIENTS_SUCCESS :
            return {...state, clients_list : action.payload.data};
        case types.GET_CLIENT_DETAIL_SUCCESS :
            return {...state, client_detail : action.payload.data};
        case types.UPDATE_CLIENT :
            let arrUpdate = state.clients_list;
            arrUpdate.results.map((el, i)=>{
                if(el.id === action.data.id) {
                    arrUpdate.results[i][action.data.field] = action.data.value;
                }
            });
            return {...state, clients_list : arrUpdate};
        case types.UPDATE_CLIENT_DETAIL :
            return {...state, client_detail : action.data};
        case types.PATCH_EDIT_CLIENT_SUCCESS :
            return {...state, client_detail : action.payload.data};
        case types.REMOVE_CLIENT :
            let clientsObj = state.clients_list;
            let arrRemove = state.clients_list.results.filter(el=>
                el.id !== action.data.id
            );
            clientsObj.results = arrRemove;
            return {...state, clients_list : clientsObj};
        case types.GET_CLIENTS_FAIL :
            return {...state, clients_error : action.error.response.data};
        case types.GET_CLIENT_DETAIL_FAIL :
            return {...state, client_inner_error : action.error.response.data};
        case types.POST_INVITE_CLIENT_FAIL :
            return {...state, clients_action_error : action.error.response.data};
        case types.DELETE_CLIENT_FAIL :
            return {...state, clients_action_error : action.error.response.data};
    }
    return state;
}