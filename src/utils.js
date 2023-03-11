import {resolve} from 'path';
import {readFileSync, readdirSync} from 'node:fs';
import {yamlParse} from 'yaml-cfn';

export const logInfo = (key, value) => console.log(key, chalk.cyan(value));
export const logWarn = (key, value) => console.log(key, chalk.yellow(value));

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
	const modulesPath = resolve(currentScript, '../operations/');

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

