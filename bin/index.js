#!/usr/bin/env node

import '../src/globals.js';
import {
	getTemplatePaths,
	settleStackName,
	settleServiceName,
} from '../src/index.js';
import CFN from '../src/cloudformation.js';
import {
	// logInfo,
	logDanger,
	logSuccess,
	logFailure,
	logCounter,
	logResource,
	logNoStack,
	loadModules,
	getServiceKey,
	logTemplatePath,
} from '../src/utils.js';
import {
	serviceNamePrompt,
	confirmInput,
} from '../src/prompts.js';

// ············································································

const templatePaths = await getTemplatePaths();

const modules = await loadModules();
console.log('modules:', Object.keys(modules));

const cfn = new CFN();

const processResource = async (serviceName, resource) => {
	const {ResourceType, PhysicalResourceId} = resource;

	const Key = getServiceKey(ResourceType);

	logResource(Object.keys(modules), Key, ResourceType, PhysicalResourceId);

	// Call the tagger module
	if (Key in modules === false) {
		return;
	}

	const {ServiceName} = await serviceNamePrompt(serviceName);
	const payload = {PhysicalResourceId, ServiceName};

	await modules[Key].plan(payload);

	const {confirm} = await confirmInput('confirm', 'Are you sure?', true);
	if (confirm === false) {
		return;
	}

	try {
		const response = await modules[Key].default(payload);
		logSuccess(response);
	} catch (error) {
		logFailure(error.message);
	}
};

for (const [i, path] of templatePaths.entries()) {
	logTemplatePath(path, i, templatePaths);

	const StackName = await settleStackName(path);
	logDanger('StackName:', StackName);

	if (!StackName) {
		logNoStack(path);
		continue;
	}

	const serviceName = await settleServiceName(path);
	logDanger('ServiceName:', serviceName);

	const {StackResources} = await cfn.listResources(StackName);

	for (const resource of StackResources) {
		logCounter();
		await processResource(serviceName, resource);
	}
}
