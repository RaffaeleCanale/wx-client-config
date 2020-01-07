import Joi from 'joi';
import yargs from 'yargs';
import path from 'path';
import readConfig, { ConfigFileOptions, Config, createConfig } from './config/configReader';
import FileGet from './api/fileGet';
// import GlobalConfig from 'globalConfig';
// import Logger from 'js-utils/logger';


const argsSchema = Joi.object().keys({
    project: Joi.string().optional(),
    config: Joi.string().default('.wxrc'),
    domains: Joi.string().optional(),
    domain: Joi.string().optional(),
}).unknown();


const argv = yargs.version(false).argv;


async function main(argv: any): Promise<any> {
    const args = await Joi.validate(argv, argsSchema);
    let mode = args._[0] || 'pull';

    let config;
    if (mode === 'bootstrap') {
        config = await createConfig({
            config: [ '.wxrc' ],
        }, args);
        mode = 'pull';
    } else if (mode === 'generate-token') {
        config = await createConfig({}, args);
    } else {
        config = await readConfig(args.config, args);
    }

    const service = new FileGet(config);


    if (mode === 'generate-token') {
        const domains = args._.slice(1);
        if (domains.length === 0) {
            throw new Error('Must have at least 1 domain');
        }
        console.log('Generating token for domains', domains)
        return generateToken(service, domains);
    } else if (mode === 'versions') {
        const versions = await getAllVersions(service, config);
        console.log(versions);
    } else if (mode === 'push') {
        return Promise.all(config.files.map((file) => service.push(file)));
    } else if (mode === 'pull') {
        return Promise.all(config.files.map((file) => service.get(file)))
    } else {
        throw new Error(`Unrecognised mode: ${mode}`);
    }

}

main(argv).catch((error: Error) => console.error(error.message));

async function generateToken(service: FileGet, domains: string[]) {
    const { token } = await service.requestToken(domains);
    console.log(
        `Your token is:

${token}
`
    );
}

function getAllVersions(service: FileGet, config: Config): Promise<any> {
    const result: any = {};
    const promises = config.files.map((file) =>
        service.getVersions(file).then((versions) => {
            result[file.file] = versions;
        })
    );

    return Promise.all(promises).then(() => JSON.stringify(result, null, 4));
}