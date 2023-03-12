import {AthenaClient, TagResourceCommand} from '@aws-sdk/client-athena';

export default async function (physicalResourceId, serviceName) {
	const arn = `arn:aws:athena:${global.region}:${global.awsAccountId}:work-group:${physicalResourceId}`;

	const client = new AthenaClient({region});
	const input = {
		Resource: arn,
		Tags: {
			'user:aws-resource': 'athena',
			'user:service': serviceName,
		},
	};

	const command = new TagResourceCommand(input);
	const response = await client.send(command);
	console.log('response:', response);
}

