import {
	ElasticsearchServiceClient,
	AddTagsCommand,
} from '@aws-sdk/client-elasticsearch-service';

const _input = (arn, serviceName) => ({
	ARN: arn,
	TagList: [
		{Key: 'user:aws-resource', Value: 'Elasticsearch'},
		{Key: 'user:service', Value: serviceName},
	],
});

export default function ({PhysicalResourceId, ServiceName}) {
	const input = _input(PhysicalResourceId, ServiceName);
	const client = new ElasticsearchServiceClient({region});
	const command = new AddTagsCommand(input);
	return client.send(command);
}

export function plan({PhysicalResourceId, ServiceName}) {
	console.log(_input(PhysicalResourceId, ServiceName));
}

