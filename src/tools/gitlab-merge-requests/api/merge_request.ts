import axios from "axios";

export const getMergeRequests = (token, params) => {
    return axios({
        url: '/api/gitlab/merge_requests',
        method: 'get',
        params: params,
        headers: {
            'PRIVATE-TOKEN': token
        }
    })
}
