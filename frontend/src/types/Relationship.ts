export interface Relationship {
	source_id: number;
	target_id: number;
	type: string;
};

export enum VRelationships {
	FRIEND = "friend",
	BLOCKED = "blocked",
	NONE = "NONE"
  }