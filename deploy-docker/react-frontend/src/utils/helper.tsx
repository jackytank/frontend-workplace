export type UserDataType = {
    username: string;
    gender: GenderEnum;
    receiverName: string;
    connected: boolean;
    message: string;
};

export type PositionMessType = 0 | 2 | 1 | "first" | "last" | "single" | "normal" | 3;

export type FormType = {
    username: string;
    gender: GenderEnum;
};

export enum GenderEnum {
    MALE, FEMALE
}


export type ChatMessage = {
    senderName: string;
    receiverName?: string;
    message?: string;
    date?: string;
    status: StatusEnum | MessageStatus;
};

export enum StatusEnum {
    JOIN,
    MESSAGE,
    LEAVE
}

export enum MessageStatus {
    JOIN = 'JOIN',
    MESSAGE = 'MESSAGE',
    LEAVE = 'LEAVE'
}

export const CHAT_ROOM = 'Chatroom';