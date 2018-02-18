import Joi from 'joi';
import _ from 'lodash';
import { readJson } from 'util/fileUtils';

const files = Joi.array().items(
    Joi.object().keys({
        name: Joi.string().required(),
        output: Joi.string().required(),
    })
).min(1)

const schema = Joi.object().keys({
    hostname: Joi.string().required(),
    token: Joi.string().base64({ paddingRequired: false }).optional(),
    files,
})



export function readConfig(filename, defaults) {
    return readJson(filename)
        .then((config) => Joi.validate(_.defaults(config, defaults), schema))
}
