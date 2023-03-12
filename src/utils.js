import {resolve} from 'path';
import {readFileSync, readdirSync} from 'node:fs';
import {yamlParse} from 'yaml-cfn';
import {STSClient, GetCallerIdentityCommand} from '@aws-sdk/client-sts';

const {log} = console;
export const logInfo = (key, value, etc = '') => log(key, chalk.cyan(value), chalk.bold.red(etc));
export const logWarn = (key, value, etc = '') => log(key, chalk.yellow(value), chalk.bold.red(etc));
export const logDanger = (key, value, etc = '') => log(key, chalk.red(value), chalk.bold.red(etc));

export function capitalize(str) {
	return `${str[0].toUpperCase()}${str.substring(1, str.length)}`;
}

export function getImmediateBaseName(path) {
	const parts = path.split('/').reverse();
	const [, baseName] = parts;
	return baseName;
}

export function parseTemplate(path) {
	const raw = readFileSync(path, {encoding: 'utf8'});

	const {Metadata} = yamlParse(raw);

	return Metadata;
}

export async function loadModules() {
	const [, currentScript] = import.meta.url.split('file://');
	const modulesPath = resolve(currentScript, '../../drivers/');

	const files = readdirSync(modulesPath);

	const modules = await Promise
		.all(files
			.map(x => import(`${modulesPath}/${x}`)),
		);

	return files
		.map(x => x.split('.')[0])
		.reduce((acc, cur, i) =>
			({...acc, [cur]: modules[i]})
		, {});
}

export const logResource = (modules, resourceType, physicalResourceId) => {
	const active = modules.includes(resourceType);
	console.log(
		chalk[active ? 'yellow' : 'blue'](resourceType),
		chalk.bold[active ? 'green' : 'cyan'](physicalResourceId),
	);
};

export function getAccountId() {
	const client = new STSClient();
	const command = new GetCallerIdentityCommand();
	return client.send(command);
}

export const fillTo = str => Array
	.from(str)
	.map(_ => '╸').join('');
