import {LambdaClient, TagResourceCommand} from '@aws-sdk/client-lambda';

const _input = (arn, serviceName) => ({
	Resource: arn,
	Tags: {
		'user:aws-resource': 'Lambda',
		'user:service': serviceName,
	},
});

export default function ({PhysicalResourceId, ServiceName}) {
	const arn = `arn:aws:lambda:${global.region}:${global.awsAccountId}:function:${PhysicalResourceId}`;
	const input = _input(arn, ServiceName);
	const client = new LambdaClient({region});
	const command = new TagResourceCommand(input);
	return client.send(command);
}

export function plan({PhysicalResourceId, ServiceName}) {
	console.log(_input(PhysicalResourceId, ServiceName));
}
