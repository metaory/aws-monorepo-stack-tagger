import 'zx/globals';
import {
	autocompleteInput,
} from '../src/prompts.js';
import {
	logDanger,
	logWarn,
	capitalize,
	getAccountId,
} from '../src/utils.js';

$.verbose = argv.verbose ?? argv.v ?? false;
global.region = process.env.AWS_REGION || 'ap-southeast-1';

// const noop = () => {};
// process.on('uncaughtException', $.verbose ? console.error : noop);
// process.on('unhandledRejection', $.verbose ? console.error : noop);
process.on('SIGINT', process.exit);

if (argv.force && !argv.env) {
	logDanger('missing', 'env argument');
	logWarn('try', '-- env staging');
	process.exit(1);
}

let env;
if (argv.env) {
	env = argv.env;
} else {
	const envPromptResponse = await autocompleteInput('env', ['staging', 'production']);
	env = envPromptResponse.env;
}

if (!env) {
	logDanger('missing', 'env');
	process.exit(1);
}

global.env = env;
global.Env = capitalize(env);

const {Account} = await getAccountId();
global.awsAccountId = Account;
