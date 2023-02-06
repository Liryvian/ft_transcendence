import type { User } from "./User";

export interface Relationship {
	id: number;

	source_id: User;
	target_id: User;

	type: string;
};

export enum ValidRelationships {
	FRIEND = "friend",
	BLOCKED = "blocked",
	NONE = "none"
  }