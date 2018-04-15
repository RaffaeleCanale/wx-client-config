import Joi from 'joi';
import yargs from 'yargs';
import { readConfig } from 'config/configReader';
import FileGet from 'api/fileGet';
import GlobalConfig from 'globalConfig';
import Logger from 'js-utils/logger';


const argv = yargs.array('token').argv;
const argsSchema = Joi.object().keys({
    config: Joi.string().default('.wxrc'),
    token: Joi.array().items(Joi.string()).optional(),
}).unknown();


const result = Joi.validate(argv, argsSchema)
if (result.error !== null) {
    throw Error(result.error);
}
const params = result.value;
readConfig(params.config, GlobalConfig)
    .then((config) => {
        const service = new FileGet(config);
        if (params.token) {
            return service.requestToken(params.token)
                .then(({ token }) => {
                    Logger.info('Token:', token);
                });
        } else {
            return Promise.all(config.config.map((file) => service.get(file)))
        }
    })
    .catch((err) => {
        Logger.error(err);
        process.exit(1);
    });
