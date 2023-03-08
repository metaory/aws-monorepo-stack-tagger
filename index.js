// Const AWS = require("aws-sdk");
// const cloudFormation = new AWS.CloudFormation();
// const { CloudFormationClient, DescribeStacksCommand, } = require("@aws-sdk/client-cloudformation");
import {
	CloudFormationClient,
	DescribeStackResourcesCommand,
	// DescribeStackResourceCommand,
	// ActivateTypeCommand,
} from '@aws-sdk/client-cloudformation';
import {STSClient, GetCallerIdentityCommand} from '@aws-sdk/client-sts';

global.region = process.env.AWS_REGION || 'ap-southeast-1';
const StackName = 'staging--web-app-server';

const cf = new CloudFormationClient({region});

async function loadModule(resourceType) {
	const path = `./src/operations/${resourceType}.js`;
	try {
		const mod = await import(path);
		return mod.default;
	} catch (error) {
		console.log(error.message, path);
		return () => {};
	}
}

async function getAccountId() {
	const client = new STSClient();
	const command = new GetCallerIdentityCommand();
	const {Account} = await client.send(command);
	return Account;
}

async function init() {
	global.accountId = await getAccountId();

	const {StackResources} = await cf.send(
		new DescribeStackResourcesCommand({StackName}),
	);

	console.log('StackResources:', StackResources);

	for (const resource of StackResources) {
		const {ResourceType, PhysicalResourceId} = resource;

		const mod = await loadModule(ResourceType);

		mod(PhysicalResourceId);
	}
}

init().then(console.log).catch(console.error);
