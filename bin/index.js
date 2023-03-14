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
	logWarn,
	fillTo,
	loadModules,
	logResource,
	getServiceKey,
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

for (const [i, path] of templatePaths.entries()) {
	console.log('---------------------------');
	logWarn('template path:', path, `${i}/${templatePaths.length}`);

	const StackName = await settleStackName(path);
	logDanger('StackName:', StackName);

	const serviceName = await settleServiceName(path);
	logDanger('ServiceName:', serviceName);

	const {StackResources} = await cfn.listResources(StackName);
	for (const resource of StackResources) {
		const {ResourceType, PhysicalResourceId} = resource;

		const Key = getServiceKey(ResourceType);

		logResource(Object.keys(modules), Key, ResourceType, PhysicalResourceId);

		// Call the tagger module
		if (Key in modules) {
			const {ServiceName} = await serviceNamePrompt(serviceName);
			const payload = {PhysicalResourceId, ServiceName};
			await modules[Key].plan(payload);
			const {confirm} = await confirmInput('confirm');
			if (confirm === false) {
				continue;
			}

			try {
				const response = await modules[Key].default(payload);
				console.error(chalk.green(fillTo()));
				console.log('response:', response);
				console.error(chalk.green(fillTo()));
			} catch (error) {
				console.error(chalk.red(fillTo(error.message)));
				console.error(chalk.red(error.message));
				console.error(chalk.red(fillTo(error.message)), '\n');
			}
		}
	}
}

// ............................................................................
// ············································································
// ············································································
// ////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////
// ############################################################################
// ############################################################################
// ############################################################################
// ############################################################################
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
