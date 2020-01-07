import _ from 'lodash';
import axios, { AxiosInstance } from 'axios';
import bcrypt from 'bcrypt';
// @ts-ignore
import read from 'read';
import fs from 'fs';
import CryptoJS from 'crypto-js';

// @ts-ignore
import { getLogger } from 'js-utils/logger';

import { Config, ConfigFile } from '../config/configReader';


function getHeaders(config: Config): any {
    const headers: any = {};

    headers['X-WX-Authorization'] = `Bearer ${config.token}`;
    if (config.basicAuth) {
        headers['Authorization'] = `Basic ${Buffer.from(config.basicAuth).toString('base64')}`;
    }

    return headers;
}

function inputPassword(message = 'Input password: '): Promise<string> {
    return new Promise((resolve, reject) => {
        read({ prompt: message, silent: true }, (err: Error, password: string) => {
            if (err) return reject(err);
            return resolve(password);
        });
    });
}

async function processOutputContent(content: string, item: ConfigFile): Promise<string> {
    if (item.encrypted) {
        const password = await inputPassword(`Input password for ${item.file}: `);
        return CryptoJS.AES.encrypt(content, password).toString();
    }
    return content;
}

async function processResponseContent(content: string, item: ConfigFile): Promise<string> {
    if (item.encrypted) {
        const password = await inputPassword(`Input password for ${item.file}: `);
        const result = await CryptoJS.AES.decrypt(content, password).toString(CryptoJS.enc.Utf8);
        if (!result) {
            throw new Error('Wrong password ' + password);
        }
        return result;
    }
    return content;
}

export default class FileGet {

    private client: AxiosInstance;
    private logger: any;

    constructor(config: Config) {
        this.client = axios.create({
            baseURL: config.hostname,
            timeout: _.get(config, 'timeout', 1000),
            headers: getHeaders(config),
            transformResponse: _.identity(),
        });
        this.logger = getLogger(`${config.hostname}`);
    }

    private async executeGet(url: string, params: object): Promise<any> {
        this.logger.info('GET', url, params);
        const { data } = await this.client.get(url, { params });
        return JSON.parse(data);
    }

    private async executePost(url: string, body: object): Promise<any> {
        this.logger.info('GET', url, body);
        const { data } = await this.client.post(url, body);
        return JSON.parse(data);
    }

    async get(item: ConfigFile): Promise<any> {
        let { content } = await this.executeGet(
            '/api/config',
            {
                file: item.file,
                path: item.project,
                version: item.version,
                domain: item.domain,
            },
        );
        content = await processResponseContent(content, item);

        fs.writeFileSync(item.output, content);
    }

    async push(item: ConfigFile): Promise<any> {
        if (!item.domain) {
            throw new Error('Domain is not specified');
        }

        let content = fs.readFileSync(item.output, 'utf8');
        content = await processOutputContent(content, item);
        return await this.executePost(
            '/api/config',
            {
                file: item.file,
                path: item.project,
                domain: item.domain,
                content,
            }
        )
    }

    async requestToken(domains: string[]): Promise<any> {
        const password = await inputPassword();
        const hash = await bcrypt.hash(password, 10);

        return await this.executePost(
            '/api/login/token',
            { domains, hash },
        );
    }

    getVersions(item: ConfigFile): Promise<any> {
        return this.executeGet(
            '/api/config/versions',
            {
                file: item.file,
                path: item.project,
                domain: item.domain,
            }
        );
    }

}
