import * as types from "../actions/constants";

const INITIAL_STATE = {
    channels_list: {},
    channel_detail: {},
    channel_issues: {},
    channel_logs: {},
    channel_pool_switching: {},
    rent: {},
    rent_transactions: {},
    wtm_list: {},
    internal_wallets: {},
    platforms: [],
    channels_error:[],
    channels_inner_error: [],
    channel_issues_error: [],
    channel_logs_error: [],
    channel_pool_switching_error: []
};

export default function(state=INITIAL_STATE, action) {
    switch(action.type) {
        case types.GET_CHANNELS_SUCCESS :
            return {...state, channels_list : action.payload.data};
        case types.GET_CHANNEL_DETAIL_SUCCESS :
            let arrUrl = action.payload.config.url.split('/');
            let id = arrUrl[arrUrl.length - 2];
            return {...state, channel_detail : {...action.payload.data, id: Number(id)}};
        case types.PATCH_EDIT_CHANNEL_SUCCESS :
            let arrUrl2 = action.payload.config.url.split('/');
            let id2 = arrUrl2[arrUrl2.length - 2];
            return {...state, channel_detail : {...action.payload.data, id: Number(id2)}};
        case types.UPDATE_CHANNEL :
            let arrUpdate = state.channels_list;
            arrUpdate.results.forEach((el, i)=>{
                if(el.id === action.data.id) {
                    arrUpdate.results[i].watcher_url = action.data.url;
                }
            });
            return {...state, channels_list : arrUpdate};
        case types.UPDATE_CHANNEL_DETAIL :
            let objUpdate = state.channel_detail;
            objUpdate.pool = action.data.pool;
            return {...state, channel_detail : objUpdate};
        case types.UPDATE_AUTO_SWITCH :
            let objUpdateSwitch = state.wtm_list;
            objUpdateSwitch[action.data.field_switch] = action.data.field_switch_value;
            objUpdateSwitch[action.data.field_switch_min] = action.data.field_switch_min_value;
            objUpdateSwitch[action.data.field_change] = action.data.field_change_value;
            return {...state, wtm_list : objUpdateSwitch};
        case types.GET_INTERNAL_WALLETS_SUCCESS :
            return {...state, internal_wallets : action.payload.data};
        case types.GET_PLATFORMS_SUCCESS :
            return {...state, platforms : action.payload.data};
        case types.GET_CHANNEL_ISSUES_SUCCESS :
            return {...state, channel_issues : action.payload.data};
        case types.GET_CHANNEL_LOGS_SUCCESS :
            return {...state, channel_logs : action.payload.data};
        case types.GET_CHANNEL_POOL_SWITCHING_SUCCESS :
            return {...state, channel_pool_switching : action.payload.data};
        case types.GET_RENT_SUCCESS :
            return {...state, rent : action.payload.data};
        case types.UPDATE_RENT :
            let objUpdateRent = state.rent;
            objUpdateRent[action.data.field_specific_fee] = action.data.field_specific_fee_value;
            objUpdateRent[action.data.field_wallet_to_use] = action.data.field_wallet_to_use_value;
            objUpdateRent[action.data.field_specific_address] = action.data.field_specific_address_value;
            return {...state, rent : objUpdateRent};
        case types.GET_RENT_TRANSACTIONS_SUCCESS :
            return {...state, rent_transactions : action.payload.data};
        case types.GET_WTM_LIST_SUCCESS :
            return {...state, wtm_list : action.payload.data};
        case types.GET_CHANNELS_FAIL :
            return {...state, channels_error : action.error.response.data};
        case types.GET_CHANNEL_DETAIL_FAIL :
            return {...state, channels_inner_error : action.error.response.data};
        case types.GET_PLATFORMS_FAIL :
            return {...state, channels_inner_error : action.error.response.data};
        case types.GET_CHANNEL_ISSUES_FAIL :
            return {...state, channel_issues_error : action.error.response.data};
        case types.GET_CHANNEL_LOGS_FAIL :
            return {...state, channel_logs_error: action.error.response.data};
        case types.GET_CHANNEL_POOL_SWITCHING_FAIL :
            return {...state, channel_logs_error: action.error.response.data};
    }
    return state;
}