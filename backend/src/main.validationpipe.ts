/*
	whitelist: strips property values that do not exist in the expected DTO (DTO acts as a whitelist)
	transform: transforms the plain js object to the actual DTO class (performs string to number conversions etc)
	forbidNonWhitelisted: throw an error if any non-whitelisted property is present in the incoming object (<--- do we want this?)
*/
export function globalValidationPipeOptions() {
	return {
		whitelist: true,
		transform: true,
		forbidNonWhitelisted: true,
	};
}
