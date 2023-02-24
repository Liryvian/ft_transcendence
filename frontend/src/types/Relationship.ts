export interface Relationship {
	id: number;

	source: number;
	target: number;
	specifier_id: number;

	type: string;
}

export enum ValidRelationships {
	FRIEND = 'friend',
	BLOCKED = 'blocked',
	NONE = 'none',
}
