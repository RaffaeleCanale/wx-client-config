import _ from 'lodash';
import Joi from 'joi';
import { argv } from 'yargs';
import { readConfig } from 'config/configReader';
import FileGet from 'api/fileGet';


const argsSchema = Joi.object().keys({
    config: Joi.string().default('.wxrc'),
}).unknown();


const result = Joi.validate(argv, argsSchema)
if (result.error !== null) {
    throw Error(result.error);
}
const params = result.value;

readConfig(params.config)
    .then((config) => {
        const service = new FileGet(config)
        return Promise.all(config.files.map((file) => service.get(file)))
    }).catch(console.error)
