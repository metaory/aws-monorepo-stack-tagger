import {CloudWatchClient, TagResourceCommand} from '@aws-sdk/client-cloudwatch';

export default async function (physicalResourceId) {
	const arn = `arn:aws:logs:${global.region}:${global.accountId}:log-group:${physicalResourceId}`;

	const client = new CloudWatchClient({region});
	const input = {
		ResourceARN: arn,
		Tags: {
			'user:aws-resource': 'log-group',
			'user:service': 'Zelda',
		},
	};

	const command = new TagResourceCommand(input);
	const response = await client.send(command);
	console.log('response:', response);
}
