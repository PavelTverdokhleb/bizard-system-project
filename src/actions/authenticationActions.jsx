import * as types from './constants.jsx';

export function postSignIn(data) {
    return {
        type: types.POST_SIGN_IN,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/auth/signin/`,
                method: "post",
                data
            }
        }
    };
}

export function postConfirm(data) {
    return {
        type: types.POST_CONFIRM,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/auth/signin/confirm/`,
                method: "post",
                data
            }
        }
    };
}

export function postSignUp(data) {
    return {
        type: types.POST_SIGN_UP,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/auth/signup/`,
                method: "post",
                data
            }
        }
    };
}

export function postActivation(data) {
    return {
        type: types.POST_ACTIVATION,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/auth/activate/`,
                method: "post",
                data
            }
        }
    };
}

export function postResend(data, type) {
    return {
        type: types.POST_RESEND,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/auth/${type}/resend/`,
                method: "post",
                data
            }
        }
    };
}

export function postRecoverFirstStep(data) {
    return {
        type: types.POST_RECOVER_FIRST_STEP,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/auth/recovery/`,
                method: "post",
                data
            }
        }
    };
}

export function postRecoverThirdStep(data) {
    return {
        type: types.POST_RECOVER_THIRD_STEP,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/auth/recovery/complete/`,
                method: "post",
                data
            }
        }
    };
}