
export interface User {
	name: string;
	id: number;
	relationships: any[];
};

type RelationshipRequest = {
	source_id: number;
	target_id: number;
	type: string;
  }