import * as types from "../actions/constants";

const INITIAL_STATE = {
    financial_transactions: {},
    financial_billing: {},
    clients_list: [],
    channels_list: [],
    transactions_error: [],
    billing_error: []
};

export default function(state=INITIAL_STATE, action) {
    switch(action.type) {
        case types.GET_FINANCIAL_TRANSACTIONS_SUCCESS :
            return {...state, financial_transactions : action.payload.data};
        case types.GET_FINANCIAL_BILLING_SUCCESS:
            return {...state, financial_billing : action.payload.data};
        case types.GET_CLIENTS_LIST_SUCCESS:
            return {...state, clients_list : action.payload.data};
        case types.GET_CHANNELS_LIST_SUCCESS:
            return {...state, channels_list : action.payload.data};
        case types.GET_FINANCIAL_TRANSACTIONS_FAIL :
            return {...state, transactions_error : action.error.response.data};
        case types.GET_FINANCIAL_BILLING_FAIL :
            return {...state, billing_error : action.error.response.data};
        case types.GET_CLIENTS_LIST_FAIL :
            return {...state, transactions_error : action.error.response.data};
        case types.GET_CHANNELS_LIST_FAIL :
            return {...state, transactions_error : action.error.response.data};
    }
    return state;
}