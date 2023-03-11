import {
	CloudFormationClient,
	// DescribeStackResourcesCommand,
	DescribeStackResourcesCommand,
	ListStacksCommand,
	// GetTemplateCommand,
	// DescribeStackResourceCommand,
	// ActivateTypeCommand,
} from '@aws-sdk/client-cloudformation';

export default class CloudFormation {
	#region;
	#client;
	constructor() {
		const region = process.env.AWS_REGION || 'ap-southeast-1';
		this.region = region;
		this.client = new CloudFormationClient({region});
	}

	listStacks() {
		const command = new ListStacksCommand({});
		return this.client.send(command);
	}

	listResources(StackName) {
		const command = new DescribeStackResourcesCommand({StackName});
		return this.client.send(command);
	}

	stackName(_path) { }
}
