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
} from '../src/utils.js';
import {
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

	const ServiceName = await settleServiceName(path);
	logDanger('ServiceName:', ServiceName);

	const {StackResources} = await cfn.listResources(StackName);
	for (const resource of StackResources) {
		const {ResourceType, PhysicalResourceId} = resource;
		logResource(Object.keys(modules), ResourceType, PhysicalResourceId);

		// Call the tagger module
		if (ResourceType in modules) {
			const payload = {PhysicalResourceId, ServiceName};
			await modules[ResourceType].plan(payload);
			const {confirm} = await confirmInput('confirm');
			if (confirm === false) {
				continue;
			}

			try {
				const response = await modules[ResourceType].default(payload);
				console.log('response:', response);
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
