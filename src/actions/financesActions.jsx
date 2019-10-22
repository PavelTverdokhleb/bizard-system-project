import * as types from './constants.jsx';

export function getFinancialTransactions(params) {
    return {
        type: types.GET_FINANCIAL_TRANSACTIONS,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/finances/transactions/${params.length ? `?${params.join('&')}` : ''}`,
                method: "get"
            }
        }
    };
}

export function getFinancialBilling(params) {
    return {
        type: types.GET_FINANCIAL_BILLING,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/finances/billing/${params.length ? `?${params.join('&')}` : ''}`,
                method: "get"
            }
        }
    };
}

export function getClientsList() {
    return {
        type: types.GET_CLIENTS_LIST,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/dropdowns/clients/`,
                method: "get"
            }
        }
    };
}

export function getChannelsList() {
    return {
        type: types.GET_CHANNELS_LIST,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/dropdowns/channels/`,
                method: "get"
            }
        }
    };
}