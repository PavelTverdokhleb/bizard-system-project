import * as types from './constants.jsx';

export function getPools(id, params) {
    let request = params.length !== 0 ? `?${params.join('&')}` : '';
    return {
        type: types.GET_POOLS,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${id}/pools/${request}`,
                method: "get"
            }
        }
    };
}

export function getPoolDetail(id, pool) {
    return {
        type: types.GET_POOL_DETAIL,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${id}/pools/${pool}/`,
                method: "get"
            }
        }
    };
}

export function postAddPool(id, data) {
    return {
        type: types.POST_ADD_POOL,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${id}/pools/`,
                method: "post",
                data
            }
        }
    };
}

export function patchEditPool(id, pool, data) {
    return {
        type: types.PATCH_EDIT_POOL,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${id}/pools/${pool}/`,
                method: "patch",
                data
            }
        }
    };
}

export function deletePool(ids) {
    return {
        type: types.DELETE_POOL,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${ids[0]}/pools/${ids[1]}/`,
                method: "delete"
            }
        }
    };
}

export function getCurrenciesSymbols() {
    return {
        type: types.GET_CURRENCIES_SYMBOLS,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/dropdowns/currencies_symbols/`,
                method: "get"
            }
        }
    };
}

export function postVerify(data) {
    return {
        type: types.POST_VERIFY,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/pool/verify/`,
                method: "post",
                data
            }
        }
    };
}