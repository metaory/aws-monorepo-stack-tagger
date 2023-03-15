import Prompt from 'enquirer';
const enquirer = new Prompt();

export const confirmPrompt = (name = 'confirm', message = 'Are you sure?', initial = false) =>
	(argv.force ?? argv.F)
		? {[name]: true}
		: enquirer.prompt({
			type: 'confirm',
			hint: `(${name})`,
			initial,
			name,
			message,
		});

// ············································································
export const stringPrompt = (name, {
	message = `enter ${chalk.bold(name)}`,
	value = `${name}-placeholder`,
	hint,
	spaceReplacer = '-',
} = {}) => enquirer.prompt({
	type: 'input',
	name,
	hint,
	result: val => val.trim().replaceAll(' ', spaceReplacer),
	message,
	default: value,
	validate: val => Boolean(val) || `${name} cant be empty!`,
});

// ············································································
export const autocompleteInput = (name, choices, message = `select ${chalk.bold(name)}`, initial = '') =>
	enquirer.prompt({
		type: 'autocomplete',
		name,
		limit: 10,
		initial,
		message,
		choices,
	});

// ············································································
export const toggleInput = (name, {message = `select ${chalk.bold(name)}`, enabled, disabled, hint, initial}) =>
	enquirer.prompt({
		type: 'toggle',
		initial,
		hint,
		enabled,
		disabled,
		name,
		message,
	});

// ············································································
export const confirmInput = (name, message = 'Are you sure?', initial = false) =>
	(argv.force ?? argv.F)
		? {[name]: true}
		: enquirer.prompt({
			type: 'confirm',
			hint: `(${name})`,
			initial,
			name,
			message,
		});

export const serviceNamePrompt = serviceName =>
	(argv.force ?? argv.F)
		? {ServiceName: serviceName}
		: stringPrompt('ServiceName',
			{message: 'Enter Service Name:', value: serviceName},
		);
