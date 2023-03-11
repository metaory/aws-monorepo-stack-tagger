// import {readFileSync} from 'node:fs';
// capitalize,
// getImmediateBaseName,
import {loadModules} from '../src/utils.js';

export async function getTemplatePaths() {
	const res = await $`find . -type f -name "template.yaml"`;
	return res.stdout.split('\n');
}

export function settleStackName(path) {
	console.group();
	console.log('settleStackName.path:', path);
	console.groupEnd();
	// return 'STACK_NAME';
	return 'staging--auth';
}

export function settleServiceName(path) {
	console.group();
	console.log('settleServiceNam.path:', path);
	console.groupEnd();
	return 'SERVICE_NAME';
}

export function getResources(stackName) {
	console.group();
	console.log(chalk.yellow('getResources.path:'), stackName);
	console.groupEnd();
	return [{ResourceType: 'RT', PhysicalResourceId: 'PRI'}];
}
