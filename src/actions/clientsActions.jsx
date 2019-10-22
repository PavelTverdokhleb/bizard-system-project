import * as types from './constants.jsx';

export function getClients(search, page) {
    return {
        type: types.GET_CLIENTS,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/?${search}page=${page}&page_size=10`,
                method: "get"
            }
        }
    };
}

export function getClientDetail(id) {
    return {
        type: types.GET_CLIENT_DETAIL,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${id}/`,
                method: "get"
            }
        }
    };
}

export function postAddClient(data) {
    return {
        type: types.POST_ADD_CLIENT,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/`,
                method: "post",
                data
            }
        }
    };
}

export function patchEditClient(id, data) {
    return {
        type: types.PATCH_EDIT_CLIENT,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${id}/`,
                method: "patch",
                data
            }
        }
    };
}

export function postInviteClient(id) {
    return {
        type: types.POST_INVITE_CLIENT,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${id}/send-invitation/`,
                method: "post"
            }
        }
    };
}

export function deleteClient(id) {
    return {
        type: types.DELETE_CLIENT,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${id}/`,
                method: "delete"
            }
        }
    };
}