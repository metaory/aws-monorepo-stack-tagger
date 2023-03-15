import {ElasticLoadBalancingV2Client, AddTagsCommand} from '@aws-sdk/client-elastic-load-balancing-v2';

const _input = (arn, serviceName) => ({
	ResourceArns: [arn],
	Tags: [
		{Key: 'user:aws-resource', Value: 'alb'},
		{Key: 'user:service', Value: serviceName},
	],
});

export default function ({PhysicalResourceId, ServiceName}) {
	const input = _input(PhysicalResourceId, ServiceName);
	const client = new ElasticLoadBalancingV2Client({region});
	const command = new AddTagsCommand(input);
	return client.send(command);
}

export function plan({PhysicalResourceId, ServiceName}) {
	console.log(_input(PhysicalResourceId, ServiceName));
}

