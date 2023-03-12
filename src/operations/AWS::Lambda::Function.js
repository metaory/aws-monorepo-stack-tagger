import {LambdaClient, TagResourceCommand} from '@aws-sdk/client-lambda';

export default async function (physicalResourceId, serviceName) {
	const arn = `arn:aws:lambda:${global.region}:${global.awsAccountId}:function:${physicalResourceId}`;

	const client = new LambdaClient({region});
	const input = {
		Resource: arn,
		Tags: {
			'user:aws-resource': 'lambda',
			'user:service': serviceName,
		},
	};

	const command = new TagResourceCommand(input);
	const response = await client.send(command);
	console.log('response:', response);
}
