// Const AWS = require("aws-sdk");
// const cloudFormation = new AWS.CloudFormation();
// const { CloudFormationClient, DescribeStacksCommand, } = require("@aws-sdk/client-cloudformation");
import {readdirSync} from 'node:fs';
import chalk from 'chalk';
import {
	CloudFormationClient,
	DescribeStackResourcesCommand,
	// DescribeStackResourceCommand,
	// ActivateTypeCommand,
} from '@aws-sdk/client-cloudformation';
import {STSClient, GetCallerIdentityCommand} from '@aws-sdk/client-sts';

// --------------------------------------------

global.region = process.env.AWS_REGION || 'ap-southeast-1';

global.log = (key, value) => console.log(
	chalk.black.bgYellow.bold(key),
	chalk.blue(value),
);

// --------------------------------------------

const [,, StackName] = process.argv;

// --------------------------------------------

const cf = new CloudFormationClient({region});

// --------------------------------------------

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

// --------------------------------------------

async function getAccountId() {
	const client = new STSClient();
	const command = new GetCallerIdentityCommand();
	const {Account} = await client.send(command);
	return Account;
}

// --------------------------------------------

async function init() {
	global.accountId = await getAccountId();

	const modules = await loadModules();

	const {StackResources} = await cf.send(
		new DescribeStackResourcesCommand({StackName}),
	);

	console.log('StackResources:', StackResources);

	for (const resource of StackResources) {
		const {ResourceType, PhysicalResourceId} = resource;
		log(ResourceType, PhysicalResourceId);

		if (ResourceType in modules) {
			modules[ResourceType].default(PhysicalResourceId);
		}
	}
}

// --------------------------------------------

init().then(console.log).catch(console.error);
