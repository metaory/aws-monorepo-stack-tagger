#!/usr/bin/env node

import '../src/globals.js';
import {
	getTemplatePaths,
	settleStackName,
	settleServiceName,
} from '../src/index.js';
import CFN from '../src/cloudformation.js';
import {
	logInfo,
	logDanger,
	logWarn,
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

	const stackName = await settleStackName(path);
	logDanger('stackName:', stackName);

	const serviceName = await settleServiceName(path);
	logDanger('serviceName:', serviceName);

	const {StackResources} = await cfn.listResources(stackName);
	for (const resource of StackResources) {
		const {ResourceType, PhysicalResourceId} = resource;
		logResource(Object.keys(modules), ResourceType, PhysicalResourceId);

		// Call the tagger module
		if (ResourceType in modules) {
			const {confirm} = await confirmInput('confirm');
			if (confirm === false) {
				continue;
			}

			await modules[ResourceType].default(PhysicalResourceId, serviceName);
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
