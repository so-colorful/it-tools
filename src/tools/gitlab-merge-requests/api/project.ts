import axios from "axios";

export const getProject = (token, projectId) => {
    return axios({
        url: '/api/gitlab/projects/' + projectId,
        method: 'get',
        headers: {
            'PRIVATE-TOKEN': token
        }
    })
}
