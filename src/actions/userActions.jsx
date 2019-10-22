import * as types from './constants.jsx';

export function getUser() {
    return {
        type: types.GET_USER,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/auth/info/`,
                method: "get"
            }
        }
    };
}

export function patchUser(data) {
    return {
        type: types.PATCH_USER,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/auth/info/`,
                method: "patch",
                data
            }
        }
    };
}