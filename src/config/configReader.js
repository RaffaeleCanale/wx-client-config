import Joi from 'joi';
import _ from 'lodash';
import { readJson } from 'js-utils/file-utils';

const files = Joi.array().items(
    Joi.object().keys({
        name: Joi.string().required(),
        output: Joi.string().required(),
    })
).min(1)

const schema = Joi.object().keys({
    hostname: Joi.string().required(),
    environment: Joi.string().optional(),
    token: Joi.string().base64({ paddingRequired: false }).optional(),
    files,
}).unknown()



export function readConfig(filename, defaults) {
    return readJson(filename)
        .then((config) => Joi.validate(_.defaults(config, defaults), schema))
}
