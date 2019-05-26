import Joi from 'joi';
import yargs from 'yargs';
import path from 'path';
import { readConfig } from 'config/configReader';
import FileGet from 'api/fileGet';
import GlobalConfig from 'globalConfig';
import Logger from 'js-utils/logger';


const argv = yargs.array('token').argv;
const argsSchema = Joi.object().keys({
    project: Joi.string().default(path.basename(process.cwd())),
    config: Joi.string().default('.wxrc'),
    domains: Joi.string().optional(),
    domain: Joi.string().optional(),
}).unknown();

const result = Joi.validate(argv, argsSchema)
if (result.error !== null) {
    throw Error(result.error);
}

const mode = argv._[0];
const params = result.value;
readConfig(params.config, GlobalConfig, params.project)
    .then((config) => {
        const service = new FileGet(config);

        if (mode === 'token') {
            return generateToken(service);
        } else if (mode === 'versions') {
            return getAllVersions(service, config).then(console.log);
        } else if (mode === 'push') {
            return Promise.all(config.config.map((file) => service.push(file, params.domain)))
        } else {
            return Promise.all(config.config.map((file) => service.get(file)))
        }
    })
    .catch((err) => {
        Logger.error(err, err.response ? err.response.data : null);
        process.exit(1);
    });


function generateToken(service) {
    if (!params.domains) {
        throw new Error('Must provide a comma separated list of domains (eg. --domains=foo,all');
    }
    const domains = params.domains.split(',');
    return service.requestToken(domains)
                .then(({ token }) => {
                    Logger.info(`Generated token available for ${domains}.\nToken:\n    ${token}`);
                });
}

function getAllVersions(service, config) {
    const result = {};
    const promises = config.config.map((file) =>
        service.getVersions(file).then((versions) => {
            result[file.file] = versions;
        })
    );

    return Promise.all(promises).then(() => console.log(JSON.stringify(result, null, 4)));
}