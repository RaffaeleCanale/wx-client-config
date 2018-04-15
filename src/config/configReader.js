import Joi from 'joi';
import _ from 'lodash';
import { readJson } from 'js-utils/file-utils';

const schema = Joi.object().keys({
    hostname: Joi.string().required(),
    token: Joi.string().optional(),
    timeout: Joi.number().optional(),
    config: Joi.array().items(Joi.string()).optional(),
}).unknown()



export function readConfig(filename, defaults) {
    return readJson(filename)
        .then((config) => Joi.validate(_.defaults(config, defaults), schema))
}
