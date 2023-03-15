import {CloudWatchLogsClient, TagResourceCommand} from '@aws-sdk/client-cloudwatch-logs';

const _input = (arn, serviceName) => ({
	resourceArn: arn,
	tags: {
		'user:aws-resource': 'Logs',
		'user:service': serviceName,
	},
});

export default function ({PhysicalResourceId, ServiceName}) {
	const arn = `arn:aws:logs:${global.region}:${global.awsAccountId}:log-group:${PhysicalResourceId}`;
	const input = _input(arn, ServiceName);
	const client = new CloudWatchLogsClient({region});
	const command = new TagResourceCommand(input);
	return client.send(command);
}

export function plan({PhysicalResourceId, ServiceName}) {
	console.log(_input(PhysicalResourceId, ServiceName));
}
