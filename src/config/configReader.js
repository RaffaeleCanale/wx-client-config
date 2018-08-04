import Joi from 'joi';
import _ from 'lodash';
import { readJson } from 'js-utils/file-utils';
import Logger from 'js-utils/logger';

const configItem = Joi.alternatives().try(
    Joi.string(),
    Joi.object().keys({
        file: Joi.string().required(),
        project: Joi.string().optional(),
        output: Joi.string().optional(),
    })
);

const schema = Joi.object().keys({
    hostname: Joi.string().required(),
    token: Joi.string().optional(),
    timeout: Joi.number().optional(),
    config: Joi.array().items(configItem).optional(),
}).unknown()


function sanitizeConfigItem(project, item) {
    if (_.isString(item)) {
        item = { file: item };
    }
    return _.defaults(item, { project, output: item.file });
}

export function readConfig(filename, defaults, project) {
    return readJson(filename)
        .catch((err) => {
            Logger.warn(`Failed to read config ${filename}, using default values`, err);
            return {};
        })
        .then(config => Joi.validate(_.defaults(config, defaults), schema))
        .then((config) => {
            config.config = _.map(config.config, sanitizeConfigItem.bind(null, project));
            return config;
        });
}
