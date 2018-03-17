import _ from 'lodash';
import axios from 'axios';
import { writeArray } from 'js-utils/file-utils'
import { getLogger } from 'js-utils/logger';

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
            timeout: _.get(config, 'timeout', 1000),
            headers: getHeaders(config),
            transformResponse: _.identity(),
        });
        this.env = config.environment;
        this.logger = getLogger(`${this.env}@${config.hostname}`);
    }

    get(fileConfig) {
        this.logger.info('GET', fileConfig)
        return this.instance.get(this._url(fileConfig))
            .then((response) => writeArray(fileConfig.output, [response.data]))
    }

    _url(fileConfig) {
        return this.env ? `/${this.env}/${fileConfig.name}` :
                        `/${fileConfig.name}`
    }

}
