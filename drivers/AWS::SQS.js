import {SQSClient, TagQueueCommand} from '@aws-sdk/client-sqs';

const _input = (QueueUrl, ServiceName) => ({
	QueueUrl,
	Tags: {
		'user:aws-resource': 'sqs',
		'user:service': ServiceName,
	},
});

export default function ({PhysicalResourceId, ServiceName}) {
	const input = _input(PhysicalResourceId, ServiceName);
	const client = new SQSClient({region});
	const command = new TagQueueCommand(input);
	return client.send(command);
}

export function plan({PhysicalResourceId, ServiceName}) {
	console.log(_input(PhysicalResourceId, ServiceName));
}

