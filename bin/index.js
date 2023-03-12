#!/usr/bin/env node

import '../src/globals.js';
import {
	getTemplatePaths,
	settleStackName,
	settleServiceName,
} from '../src/index.js';
import CFN from '../src/cloudformation.js';
import {logInfo, logWarn, loadModules} from '../src/utils.js';

// ············································································

const templatePaths = await getTemplatePaths();

const modules = await loadModules();

const cfn = new CFN();

for (const [i, path] of templatePaths.entries()) {
	console.log('---------------------------');
	logWarn('template path:', path, `${i}/${templatePaths.length}`);

	const stackName = await settleStackName(path);
	logInfo('stackName:', stackName);

	const serviceName = await settleServiceName(path);
	logInfo('serviceName:', serviceName);

	const {StackResources} = await cfn.listResources(stackName);
	for (const resource of StackResources) {
		const {ResourceType, PhysicalResourceId} = resource;
		logInfo(ResourceType, PhysicalResourceId);
	// 		// console.log('PhysicalResourceId:', PhysicalResourceId);
	// 		// await modules[ResourceType].default(PhysicalResourceId);
	}
}

// ............................................................................
// ············································································
// ············································································
// ////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////
// ############################################################################
// - [ ] parse template
// - [ ] get stackName from metadata or prompt
// - [ ] get serviceName from path or prompt
// - [ ] loop stack resources
// - [ ] tagger function
// ############################################################################
// ############################################################################
// ############################################################################
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// import { } from '../src/utils.js';
// import CloudFormation from '../src/cloudformation.js';
// const cfn = new CloudFormation();
// Const {TemplateBody: remote} = await cfn.listStacks('staging--ms-chat-activity');
// console.log('remote:', remote);
//
// const local = readFileSync('./template.yaml', {encoding: 'utf8'});
// console.log('local:', local);
// console.log('PLZ?:', remote === local);
//
// const distance = levenshtein.get(local, remote); // 2
// console.log('distance:', distance);
// process.exit();

/*
Import {yamlParse} from 'yaml-cfn';
import {capitalize, getImmediateBaseName} from '../src/utils.js';
import {confirmPrompt, stringPrompt} from '../src/prompts.js';
Function parseTemplate(path) {
	const raw = readFileSync(path, {encoding: 'utf8'});

	const {Metadata} = yamlParse(raw);

	return Metadata ?? {};
}

async function promptStackName() {
	const {stackName} = await stringPrompt('stackName');
	return stackName;
}

async function getStackNameFromPath(path) {
	const key = `${capitalize(env)}StackName`;

	const metadata = parseTemplate(path);
	console.log('metadata:', metadata);

	const stackName = metadata[key];

	return stackName;
}

for (const path of await getTemplatePaths()) {
	console.log('>>>', path);
	// eslint-disable-next-line no-await-in-loop
	const stackName = await getStackNameFromPath(path);
	console.log('stackName:', stackName);

	const serviceName = getImmediateBaseName(path);
	console.log('serviceName:', serviceName);

	console.log();
}
  */

// Const test = './service/lambda/integration/template.yaml'
// const test = '/home/meta/dev/work/respond/respond-io/service/lambda/contact-auto-assignment/template.yaml'
// console.log('getStackNameFromPath(test):', getStackNameFromPath(test))
// console.log('---------------------')
// console.log(capitalize('foobar'))
// console.log('env:', env)
//
// if (stackNames.includes(stackName) === false) {
// 	console.info('stackName:', chalk.cyan(stackName));
// 	console.error(chalk.red.bold('STACK_DOES_NOT_EXIST'));
// 	console.error(chalk.yellow('make sure the correct AWS_PROFILE is set.'));
//
// 	await $`sleep 1`;
// 	const {confirm} = await confirmPrompt('confirm', 'Are you sure you want to continue?');
// 	if (confirm) {
// 		return stackName;
// 	}
//
// 	console.log('confirm:', confirm);
// 	process.exit(1);
// }
