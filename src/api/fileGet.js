import _ from 'lodash';
import axios from 'axios';
import { writeArray } from 'util/fileUtils'

function getHeaders(config) {
    const headers = {};

    if (config.token) {
        headers['Authorization'] = `Bearer ${config.token}`;
    }

    return headers;
}

export default class FileGet {

    constructor(config) {
        this.instance = axios.create({
            baseURL: config.hostname,
            timeout: 1000,
            headers: getHeaders(config),
            transformResponse: _.identity(),
        });
    }

    get(fileConfig) {
        return this.instance.get(`/${fileConfig.name}`)
            .then((response) => writeArray(fileConfig.output, [response.data]))
    }

}
