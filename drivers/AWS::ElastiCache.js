import {ElastiCacheClient, AddTagsToResourceCommand} from '@aws-sdk/client-elasticache';

const _input = (arn, serviceName) => ({
	ResourceName: arn,
	Tags: [
		{Key: 'user:aws-resource', Value: 'ElastiCache'},
		{Key: 'user:service', Value: serviceName},
	],
});

export default function ({PhysicalResourceId, ServiceName}) {
	const input = _input(PhysicalResourceId, ServiceName);
	const client = new ElastiCacheClient({region});
	const command = new AddTagsToResourceCommand(input);
	return client.send(command);
}

export function plan({PhysicalResourceId, ServiceName}) {
	console.log(_input(PhysicalResourceId, ServiceName));
}

