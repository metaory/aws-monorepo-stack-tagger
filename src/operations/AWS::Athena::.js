// TODO: fallback
import {AthenaClient, TagResourceCommand} from '@aws-sdk/client-athena';

export default async function (physicalResourceId) {
	const arn = `arn:aws:athena:${global.region}:${global.accountId}:work-group:${physicalResourceId}`;

	const client = new AthenaClient({region});
	const input = {
		Resource: arn,
		Tags: {
			'user:aws-resource': 'athena',
			'user:service': 'Zelda',
		},
	};

	const command = new TagResourceCommand(input);
	const response = await client.send(command);
	console.log('response:', response);
}

