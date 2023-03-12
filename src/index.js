import CloudFormation from '../src/cloudformation.js';
import {
	// logInfo,
	// logWarn,
	// loadModules,
	parseTemplate,
	getImmediateBaseName,
} from '../src/utils.js';
import {
	autocompleteInput,
} from '../src/prompts.js';

// ································································
const cfn = new CloudFormation();
const completeStackList = await cfn.listStacks();
let remainingStacks = completeStackList;

// ································································
export async function getTemplatePaths() {
	const res = await $`find . -type f -name "template.yaml"`;
	return res.stdout.split('\n').filter(x => x);
}

const updateRemainingStacks = stackName => {
	remainingStacks = remainingStacks.filter(x => x.name !== stackName);
};

// ································································
export async function settleStackName(path) {
	// If baseName does exist on remote stack list, no questions asked
	const stackNameFromBaseName = `${global.env}--${getImmediateBaseName(path)}`;
	if (remainingStacks.includes(stackNameFromBaseName)) {
		updateRemainingStacks(stackNameFromBaseName);
		return stackNameFromBaseName;
	}

	// Parse template Metadata and extract StackName if exist
	const metadata = await parseTemplate(path);
	const key = `${Env}StackName`;
	if (metadata && key in metadata) {
		const metadataStackName = metadata[key];
		updateRemainingStacks(metadataStackName);
		return metadataStackName;
	}

	// Prompt for the stack name from the completeStackList
	const {stackName} = await autocompleteInput('stackName', remainingStacks);
	updateRemainingStacks(stackName);

	return stackName;
}

// ································································
export function settleServiceName(path) {
	return getImmediateBaseName(path);
}

// ································································
export function getResources(stackName) {
	console.group();
	console.log(chalk.yellow('getResources.path:'), stackName);
	console.groupEnd();
	return [{ResourceType: 'RT', PhysicalResourceId: 'PRI'}];
}

// ////////////////////////////////////////////////////////////////
