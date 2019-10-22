import * as types from "../actions/constants";

const INITIAL_STATE = {
    pools_list: [],
    pool_detail: {},
    currencies_symbols: {},
    pools_error: [],
    pools_inner_error: [],
};

export default function(state=INITIAL_STATE, action) {
    switch(action.type) {
        case types.GET_POOLS_SUCCESS :
            return {...state, pools_list : action.payload.data};
        case types.UPDATE_POOL :
            let poolsArr = state.pools_list;
            state.pools_list.forEach((el, i)=>{
               if(el.id === action.data.id){
                   poolsArr[i].primary = true;
               }
               else if(el.currency === action.data.currency) {
                   poolsArr[i].primary = false;
               }
            });
            return {...state, pools_list : poolsArr};
        case types.GET_POOL_DETAIL_SUCCESS :
            return {...state, pool_detail : action.payload.data};
        case types.GET_CURRENCIES_SYMBOLS_SUCCESS :
            return {...state, currencies_symbols : action.payload.data};
        case types.GET_POOLS_FAIL :
            return {...state, pools_error : action.error.response.data};
        case types.GET_POOL_DETAIL_FAIL :
            return {...state, pools_inner_error : action.error.response.data};
        case types.GET_CURRENCIES_SYMBOLS_FAIL :
            return {...state, pools_inner_error : action.error.response.data};
    }
    return state;
}