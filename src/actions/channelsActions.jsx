import * as types from './constants.jsx';

export function getChannels(id, page) {
    return {
        type: types.GET_CHANNELS,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${id}/channels/?page=${page}&page_size=10`,
                method: "get"
            }
        }
    };
}

export function getChannelDetail(id, channel) {
    return {
        type: types.GET_CHANNEL_DETAIL,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${id}/channels/${channel}/`,
                method: "get"
            }
        }
    };
}

export function postAddChannel(id, data) {
    return {
        type: types.POST_ADD_CHANNEL,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${id}/channels/`,
                method: "post",
                data
            }
        }
    };
}

export function patchEditChannel(id, channel, data) {
    return {
        type: types.PATCH_EDIT_CHANNEL,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${id}/channels/${channel}/`,
                method: "patch",
                data
            }
        }
    };
}

export function deleteChannel(ids) {
    return {
        type: types.DELETE_CHANNEL,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${ids[0]}/channels/${ids[1]}/`,
                method: "delete"
            }
        }
    };
}

export function getInternalWallets(id) {
    return {
        type: types.GET_INTERNAL_WALLETS,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${id}/internal-wallets/`,
                method: "get"
            }
        }
    };
}

export function getPlatforms() {
    return {
        type: types.GET_PLATFORMS,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/dropdowns/algorithms/`,
                method: "get"
            }
        }
    };
}

export function getChannelChart(ids, sort) {
    return {
        type: types.GET_CHANNEL_CHART,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${ids[0]}/channels/${ids[1]}/chart/${sort}`,
                method: "get"
            }
        }
    };
}

export function getChannelIssues(ids, page) {
    return {
        type: types.GET_CHANNEL_ISSUES,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${ids[0]}/channels/${ids[1]}/issues/?page=${page}&page_size=10`,
                method: "get"
            }
        }
    };
}

export function getChannelLogs(ids, params) {
    let request = params.length !== 0 ? `?${params.join('&')}` : '';
    return {
        type: types.GET_CHANNEL_LOGS,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${ids[0]}/channels/${ids[1]}/logs/${request}`,
                method: "get"
            }
        }
    };
}

export function getChannelPoolSwitching(ids, page) {
    return {
        type: types.GET_CHANNEL_POOL_SWITCHING,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${ids[0]}/channels/${ids[1]}/switchings/?page=${page}&page_size=10`,
                method: "get"
            }
        }
    };
}

export function getRent(ids) {
    return {
        type: types.GET_RENT,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${ids[0]}/channels/${ids[1]}/rent/`,
                method: "get"
            }
        }
    };
}

export function getRentTransactions(ids, page) {
    return {
        type: types.GET_RENT_TRANSACTIONS,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${ids[0]}/channels/${ids[1]}/rent/transactions/?page=${page}&page_size=10`,
                method: "get"
            }
        }
    };
}

export function patchSwitchRent(ids, data) {
    return {
        type: types.PATCH_SWITCH_RENT,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${ids[0]}/channels/${ids[1]}/`,
                method: "patch",
                data
            }
        }
    };
}

export function getWTMList(ids, coins) {
    return {
        type: types.GET_WTM_LIST,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${ids[0]}/channels/${ids[1]}/wtm-calculations/?coins=${coins}`,
                method: "get"
            }
        }
    };
}

export function postChangeExternalWallet(ids, data) {
    return {
        type: types.POST_CHANGE_EXTERNAL_WALLET,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${ids[0]}/channels/${ids[1]}/rent/change-external-wallet/`,
                method: "post",
                data
            }
        }
    };
}