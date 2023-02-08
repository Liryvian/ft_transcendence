import type { Chat } from "./Chat";
import type { Game, GameRequest } from "./Game";
import type { Relationship } from "./Relationship";

interface Achievement {
    name: string;
}

export interface RegisterForm {
    username: string;
    password: string;
    password_confirm: string;
}

export interface User {
    id: number;
    name: string;

    is_intra: boolean;
    intra_id: number;
    avatar: string;

    matchmaking_request: GameRequest[];
    games: Game[];

    achievements: Achievement[];
    relationships: Relationship[];

    chats: Chat[];

    created_at: Date;
    updated_at: Date;
}

