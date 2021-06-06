import { wait } from "wait/mod.ts";
import { success, error } from "utils/log.ts";

export default async function task(
	description: string,
	callback: (() => void),
	{ succeed = "done.", fail = "failed!" } = {},
) {
	const spinner = wait(description).start();

	try {
		await callback();

		spinner.succeed(`${description} ${success(succeed)}`);
	} catch (errorMsg) {
		spinner.fail(`${description} ${error(fail)}`);
		throw new Error(errorMsg);
	}
}
