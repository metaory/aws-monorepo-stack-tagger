// Const cloudFormation = new AWS.CloudFormation();
// const { CloudFormationClient, DescribeStacksCommand, } = require("@aws-sdk/client-cloudformation");

import {readdirSync} from 'node:fs';
import chalk from 'chalk';
import 'zx/globals';
import {
	CloudFormationClient,
	// eslint-disable-next-line no-unused-vars
	DescribeStackResourcesCommand,
	ListStacksCommand,
	// DescribeStackResourceCommand,
	// ActivateTypeCommand,
} from '@aws-sdk/client-cloudformation';
import {STSClient, GetCallerIdentityCommand} from '@aws-sdk/client-sts';

// -------------------------------------------- //

global.region = process.env.AWS_REGION || 'ap-southeast-1';

global.log = (key, value) => console.log(
	chalk.black.bgYellow.bold(key),
	chalk.blue(value),
);

// -------------------------------------------- //

// const [,, StackName] = process.argv;

// -------------------------------------------- //

// -------------------------------------------- //

async function loadModules() {
	const modulesPath = './src/operations';

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

// -------------------------------------------- //

// -------------------------------------------- //

async function setAccountId() {
	const client = new STSClient();
	const command = new GetCallerIdentityCommand();
	const {Account} = await client.send(command);
	global.accountId = Account;
	return Account;
}

// -------------------------------------------- //

async function init() {
	await setAccountId();

	const modules = await loadModules();
	console.log('modules:', modules);

	const z = await $`find . -type f -name "template.yaml"`;
	console.log('z:', z);

	//
	// const stacks = await getStacks();
	// console.log('stacks:', stacks);

	// const {StackResources} = await cfClient.send(
	// 	new DescribeStackResourcesCommand({StackName}),
	// );
	//
	// console.log('StackResources:', StackResources);
	//
	// for (const resource of StackResources) {
	// 	const {ResourceType, PhysicalResourceId} = resource;
	// 	log(ResourceType, PhysicalResourceId);
	//
	// 	// [[>>>  TODO: eval feasibility
	// 	const [entity, service] = ResourceType.split('::');
	// 	const fuzzyResourceType = [entity, service].join('::');
	// 	console.log('fuzzyResourceType:', fuzzyResourceType);
	// 	// <<<]]
	//
	// 	if (ResourceType in modules) {
	// 		modules[ResourceType].default(PhysicalResourceId);
	// 	}
	// }
}

// -------------------------------------------- //

