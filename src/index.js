import Joi from 'joi';
import { argv } from 'yargs';
import { readConfig } from 'config/configReader';
import FileGet from 'api/fileGet';
import GlobalConfig from 'globalConfig';
import Logger from 'js-utils/logger';


const argsSchema = Joi.object().keys({
    config: Joi.string().default('.wxrc'),
}).unknown();

const result = Joi.validate(argv, argsSchema)
if (result.error !== null) {
    throw Error(result.error);
}
const params = result.value;

readConfig(params.config, GlobalConfig)
    .then((config) => {
        const service = new FileGet(config)
        return Promise.all(config.files.map((file) => service.get(file)))
    })
    .catch(Logger.error);
