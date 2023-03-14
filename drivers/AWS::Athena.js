import {AthenaClient, TagResourceCommand} from '@aws-sdk/client-athena';

const _input = (arn, serviceName) => ({
	Resource: arn,
	Tags: {
		'user:aws-resource': 'athena',
		'user:service': serviceName,
	},
});

export default function ({PhysicalResourceId, ServiceName}) {
	const arn = `arn:aws:athena:${global.region}:${global.awsAccountId}:work-group:${PhysicalResourceId}`;
	const input = _input(arn, ServiceName);
	const client = new AthenaClient({region});
	const command = new TagResourceCommand(input);
	return client.send(command);
}

export function plan({PhysicalResourceId, ServiceName}) {
	console.log(_input(PhysicalResourceId, ServiceName));
}
