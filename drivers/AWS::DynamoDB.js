import {DynamoDBClient, TagResourceCommand} from '@aws-sdk/client-dynamodb';

const _input = (arn, serviceName) => ({
	ResourceArn: arn,
	Tags: [
		{key: 'user:aws-resource', value: 'DynamoDB'},
		{key: 'user:service', value: serviceName},
	],
});

export default function ({PhysicalResourceId, ServiceName}) {
	const input = _input(PhysicalResourceId, ServiceName);
	const client = new DynamoDBClient({region});
	const command = new TagResourceCommand(input);
	return client.send(command);
}

export function plan({PhysicalResourceId, ServiceName}) {
	console.log(_input(PhysicalResourceId, ServiceName));
}

