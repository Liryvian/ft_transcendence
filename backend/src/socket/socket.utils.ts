export function jwtCookieFromHandshakeString(str: string) {
	return str
		?.split(' ')
		.find((cookie) => cookie.startsWith('jwt='))
		?.slice(4);
}
