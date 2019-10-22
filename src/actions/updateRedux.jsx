import * as types from './constants.jsx';

//user

export function updateUser(data) {
    return {
        type: types.UPDATE_USER,
        data
    }
}

//clients

export function updateClient(data) {
    return {
        type: types.UPDATE_CLIENT,
        data
    }
}

export function updateClientDetail(data) {
    return {
        type: types.UPDATE_CLIENT_DETAIL,
        data
    }
}

export function removeClient(data) {
    return {
        type: types.REMOVE_CLIENT,
        data
    }
}

//channels

export function updateChannel(data) {
    return {
        type: types.UPDATE_CHANNEL,
        data
    }
}

export function updateChannelDetail(data) {
    return {
        type: types.UPDATE_CHANNEL_DETAIL,
        data
    }
}

export function updateRent(data) {
    return {
        type: types.UPDATE_RENT,
        data
    }
}

export function updateAutoSwitch(data) {
    return {
        type: types.UPDATE_AUTO_SWITCH,
        data
    }
}

//pools

export function updatePool(data) {
    return {
        type: types.UPDATE_POOL,
        data
    }
}