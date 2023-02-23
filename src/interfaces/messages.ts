import { NostrKind } from "./enums.ts";

export interface NostrTag {
    tagName: string;
    value: string;
}

export interface NostrFilters {
    ids?: Array<string>;
    authors?: Array<string>;
    kinds?: Array<NostrKind>;
    tags?: Array<NostrTag>;
    since?: number;
    until?: number;
    limit?: number;
}

export interface NostrEvent {
    id: string;
    pubkey: string;
    created_at: number;
    kind: NostrKind;
    tags: Array<any>;
    content: string;
    sig: string;
}

export interface NostrRequest {
    subscription_id: string;
    filters: Array<NostrFilters>;
}

export interface NostrClose {
    subscription_id: string;
}