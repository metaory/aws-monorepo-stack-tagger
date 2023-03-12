import 'zx/globals';
import {
	autocompleteInput,
} from '../src/prompts.js';
import {
	capitalize,
	getAccountId,
} from '../src/utils.js';

$.verbose = argv.verbose ?? argv.v ?? false;

// const noop = () => {};
// process.on('uncaughtException', $.verbose ? console.error : noop);
// process.on('unhandledRejection', $.verbose ? console.error : noop);
process.on('SIGINT', process.exit);

const {env} = await autocompleteInput('env', ['staging', 'production']);
global.env = env;
global.Env = capitalize(env);

const {Account} = await getAccountId();
global.awsAccountId = Account;
