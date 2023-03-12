import {CloudWatchClient, TagResourceCommand} from '@aws-sdk/client-cloudwatch';

export default async function (physicalResourceId, serviceName) {
	const arn = `arn:aws:logs:${global.region}:${global.awsAccountId}:log-group:${physicalResourceId}`;

	const client = new CloudWatchClient({region});
	const input = {
		ResourceARN: arn,
		Tags: {
			'user:aws-resource': 'log-group',
			'user:service': serviceName,
		},
	};
	console.log('input:', input);

	const command = new TagResourceCommand(input);
	const response = await client.send(command);
	console.log('response:', response);
}
