/// <reference types="vite/client" />
type ContactType = {
    first: string;
    last: string;
    avatar: string | undefined;
    twitter: string;
    notes: string;
    favorite: boolean;
};

interface ContactProps {
    contact: ContactType;
}

interface Contact {
    favorite?: boolean | undefined;
    id: string;
    first?: string;
    last?: string;
    createdAt: number;
}

interface ParamsType {
    contactId: string;
}

interface RootLoaderReturnType {
    contacts: Contact[],
    q: string | null;
}