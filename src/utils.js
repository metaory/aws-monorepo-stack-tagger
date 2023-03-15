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

export const logResource = (modules, key, resourceType, physicalResourceId) => {
	const active = modules.includes(key);
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

export const getServiceKey = ResourceType => {
	const [Entity, Service] = ResourceType.split('::');
	return [Entity, Service].join('::');
};

export const fillTo = (str = '--------------') => Array
	.from({length: str.length > process.stdout.columns
		? process.stdout.columns
		: str.length})
	.map(_ => '╸').join('');

let succeed = 0;
let failure = 0;

export const logCounter = () =>
	console.log(chalk.green('Succeed:'),
		chalk.green.bold(succeed),
		'|',
		chalk.red('Failure:'),
		chalk.red.bold(failure));

export const logSuccess = response => {
	++succeed;
	console.log(chalk.green(fillTo()));
	console.log('response:', response);
	console.log(chalk.green(fillTo()), '\n');
};

export const logFailure = message => {
	++failure;
	console.error(chalk.red(fillTo(message)));
	console.error(chalk.red(message));
	console.error(chalk.red(fillTo(message)), '\n');
};

export const logNoStack = path => {
	logDanger('no', 'StackName', 'was found');
	logWarn('skipping...', path);
};

export const logTemplatePath = (path, i, templatePaths) => {
	console.log('---------------------------');
	logWarn('template path:', path, `${i}/${templatePaths.length}`);
};
