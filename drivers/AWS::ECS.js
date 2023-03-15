import {ECSClient, TagResourceCommand} from '@aws-sdk/client-ecs';

const _input = (arn, serviceName) => ({
	resourceArn: arn,
	tags: [
		{key: 'user:aws-resource', value: 'ECS'},
		{key: 'user:service', value: serviceName},
	],
});

export default function ({PhysicalResourceId, ServiceName}) {
	const input = _input(PhysicalResourceId, ServiceName);
	const client = new ECSClient({region});
	const command = new TagResourceCommand(input);
	return client.send(command);
}

export function plan({PhysicalResourceId, ServiceName}) {
	console.log(_input(PhysicalResourceId, ServiceName));
}

