export class UserPrivacySettings {
    public user_id: number;
    public Private_profile: boolean;
    public Accept_unfollowed_account_messages: boolean;
    public Tagging: boolean;
    public data: any;

    constructor(id: number, isPrivate: boolean, messages: boolean, tagging: boolean) {
            this.user_id = id;
            this.Private_profile = isPrivate;
            this.Accept_unfollowed_account_messages = messages;
            this.Tagging = tagging;
        }
}

export class UserNotificationSettings {
    public user_id: number;
    public Likes: string;
    public Comments: string;
    public Accepted_follow_requests: string;
    public Posts: string;
    public Stories: string;
    public Messages: string;
    public data: any;

    constructor(id: number, likes: string, comments: string, accepted_follow_requests: string,
         posts: string, stories: string, messages: string) {
            this.user_id = id;
            this.Likes = likes;
            this.Comments = comments;
            this.Accepted_follow_requests = accepted_follow_requests;
            this.Posts = posts;
            this.Stories = stories;
            this.Messages = messages;
        }
}

export class MutedBlockedAccounts {
    public user_id: number;
    public Muted_blocked_accounts: string;
    public muted: Array<number>;
    public blocked: Array<number>;

    constructor(id: number, muted_blocked: string) {
            this.user_id = id;
            this.Muted_blocked_accounts = muted_blocked;
        }
}
