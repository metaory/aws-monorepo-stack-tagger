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
