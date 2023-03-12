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

	async listStacks() {
		const command = new ListStacksCommand({});
		const {StackSummaries} = await this.client.send(command);
		return [...new Set(
			StackSummaries
				.filter(({StackStatus}) => StackStatus !== 'DELETE_COMPLETE')
				.map(({StackName}) => StackName),
		)];
	}

	listResources(StackName) {
		const command = new DescribeStackResourcesCommand({StackName});
		return this.client.send(command);
	}

	stackName(_path) { }
}
