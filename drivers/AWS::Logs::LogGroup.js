import {CloudWatchClient, TagResourceCommand} from '@aws-sdk/client-cloudwatch';

const _input = (arn, serviceName) => ({
	Resource: arn,
	Tags: {
		'user:aws-resource': 'log-group',
		'user:service': serviceName,
	},
});

export default function ({PhysicalResourceId, ServiceName}) {
	const arn = `arn:aws:logs:${global.region}:${global.awsAccountId}:log-group:${PhysicalResourceId}`;
	const client = new CloudWatchClient({region});
	const input = _input(arn, ServiceName);
	const command = new TagResourceCommand(input);
	return client.send(command);
}

export function plan({PhysicalResourceId, ServiceName}) {
	console.log(_input(PhysicalResourceId, ServiceName));
}
