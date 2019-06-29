import Joi from 'joi';
import _ from 'lodash';
import path from 'path';
// @ts-ignore
import { readJson } from 'js-utils/file-utils';
// @ts-ignore
import Logger from 'js-utils/logger';

const GlobalConfig = require('../../config.json');

export interface ConfigFileOptions {
    project?: string;
    version?: number;
    domain?: string;
    encrypted?: boolean;
}

export interface ConfigFile {
    file: string,
    output: string,
    project: string,
    domain?: string,
    version?: number,
    encrypted: boolean,
}

export interface Config {
    hostname: string,
    token: string,
    timeout: number,

    files: ConfigFile[],
}


const schema = Joi.object().keys({
    hostname: Joi.string().required(),
    token: Joi.string().optional(),
    timeout: Joi.number().default(10000),

    project: Joi.string().optional(),
    version: Joi.number().optional(),
    domain: Joi.string().optional(),
    // encrypted:
    // ... {},

    config: Joi.array().items(Joi.alternatives().try(
        Joi.string(),
        Joi.object().keys({
            file: Joi.string().required(),
            project: Joi.string().optional(),
            output: Joi.string().optional(),
            version: Joi.number().optional(),
            domain: Joi.string().optional(),
            encrypted: Joi.boolean().default(false),
        })
    )).default([]),
}).unknown()

// const configItem = ;

// function sanitizeConfigItem(project: string, item: any): any {
//     if (_.isString(item)) {
//         item = { file: item };
//     }
//     return _.defaults(item, { project, output: item.file });
// }

function checkMandatoryProperties(obj: any, ...properties: string[]): void {
    properties.forEach((property: string) => {
        if (obj[property] === undefined) {
            throw new Error(`Missing property ${property}`);
        }
    });
}

function sanitizeConfigItem(configFile: any, overrideOptions: ConfigFileOptions, configFileItem: any): ConfigFile {
    if (_.isString(configFileItem)) {
        configFileItem = { file: configFileItem };
    }

    const prioritezed = _.assign({
        version: undefined,
        encrypted: false,
        project: path.basename(process.cwd()),
    }, configFile, configFileItem, overrideOptions);

    checkMandatoryProperties(prioritezed, 'project', 'encrypted');

    return {
        file: configFileItem.file,
        output: configFileItem.output || configFileItem.file,
        project: prioritezed.project,
        domain: prioritezed.domain,
        version: prioritezed.version,
        encrypted: prioritezed.encrypted,
    }
}

export default async function readConfig(filename: string, overrideOptions: ConfigFileOptions): Promise<Config> {
    let json = await readJson(filename);
    json = _.defaultsDeep(json, GlobalConfig);

    const configFile = await Joi.validate(json, schema);

    const sanitize = sanitizeConfigItem.bind(null, configFile, overrideOptions);
    return {
        hostname: configFile.hostname,
        token: configFile.token,
        timeout: configFile.timeout,
        files: configFile.config.map(sanitize),
    }
}
