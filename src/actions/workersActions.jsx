import * as types from './constants.jsx';

export function getWorkers(ids, params) {
    let request = params.length !== 0 ? `?${params.join('&')}` : '';
    return {
        type: types.GET_WORKERS,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${ids[0]}/channels/${ids[1]}/workers/${request}`,
                method: "get"
            }
        }
    };
}

export function getWorkerDetail(ids) {
    return {
        type: types.GET_WORKER_DETAIL,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${ids[0]}/channels/${ids[1]}/workers/${ids[2]}/`,
                method: "get"
            }
        }
    };
}

export function getWorkerChart(ids, sort) {
    return {
        type: types.GET_WORKER_CHART,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/${ids[0]}/channels/${ids[1]}/workers/${ids[2]}/chart/${sort}`,
                method: "get"
            }
        }
    };
}

export function getMinerChart(id, sort) {
    return {
        type: types.GET_MINER_CHART,
        payload: {
            client: 'default',
            request: {
                url: `/api/v0/business/clients/miners/${id}/chart/?interval=${sort}`,
                method: "get"
            }
        }
    };
}