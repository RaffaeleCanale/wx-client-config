import _ from 'lodash';
import axios from 'axios';
import bcrypt from 'bcrypt';
import read from 'read';
import fs from 'fs';
import { writeArray } from 'js-utils/file-utils'
import { getLogger } from 'js-utils/logger';

function getHeaders(config) {
    const headers = {};

    if (config.token) {
        headers['Authorization'] = `Bearer ${config.token}`;
    }

    return headers;
}

function inputPassword() {
    return new Promise((resolve, reject) => {
        read({ prompt: 'Input password: ', silent: true }, (err, password) => {
            if (err) return reject(err);
            return resolve(password);
        });
    });
}

export default class FileGet {

    constructor(config) {
        this.instance = axios.create({
            baseURL: config.hostname,
            timeout: _.get(config, 'timeout', 1000),
            headers: getHeaders(config),
            transformResponse: _.identity(),
        });
        this.logger = getLogger(`${config.hostname}`);
    }

    get(item) {
        const { file, project, output, version, domain } = item;
        const url = '/api/config';
        const params = { file, path: project };
        if (version !== undefined) {
            params.version = version;
        }
        if (domain !== undefined) {
            params.domain = domain;
        }
        this.logger.info('GET', url, params);
        return this.instance.get(url, { params })
            .then(({ data }) => {
                const response = JSON.parse(data);
                fs.writeFileSync(output, response.content);
            });
    }

    push(item, domainOverride) {
        const { file, project, output, domain } = item;
        const url = '/api/config';
        const data = {
            file,
            path: project,
            domain: domain || domainOverride,
            content: fs.readFileSync(output, 'utf8'),
        };

        this.logger.info('POST', url);
        return this.instance.post(url, data)
            .then(response => JSON.parse(response.data));
    }

    requestToken(domains) {
        return inputPassword()
            .then(password => {
                return bcrypt.hash(password, 10);
            })
            .then((hash) => {
                const url = '/api/login/token';
                const data = { domains, hash };
                this.logger.info('POST', url, data);
                return this.instance.post(url, data).then(response => JSON.parse(response.data));
            });
    }

    getVersions(item) {
        const { file, project, domain } = item;
        const url = '/api/config/versions';
        const params = { file, path: project };
        if (domain !== undefined) {
            params[domain] = domain;
        }
        this.logger.info('GET', url, params);
        return this.instance.get(url, { params })
            .then(({ data }) => JSON.parse(data));
    }

}
