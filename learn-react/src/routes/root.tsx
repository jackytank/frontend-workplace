import { Outlet, useLoaderData, Form, redirect, NavLink, useNavigation, useSubmit } from "react-router-dom";
import { getContacts, createContact } from "../contacts";
import { useEffect } from "react";



const Root = () => {
    const { contacts, q } = useLoaderData() as RootLoaderReturnType;
    const navigation = useNavigation();
    const submit = useSubmit();

    const searchFormOnChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
        submit(event.currentTarget.form);
    };

    const searching =
        navigation.location &&
        new URLSearchParams(navigation.location.search).has("q");

    useEffect(() => {
        (document.getElementById('q') as HTMLInputElement).value = q as string;
    }, [q]);

    return (
        <>
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    <Form id='search-form' role='search'>
                        <input
                            id='q'
                            className={searching ? 'loading' : ''}
                            aria-label='Search contact'
                            placeholder='Search...'
                            type='search'
                            name='q'
                            defaultValue={q as string}
                            onChange={searchFormOnChangeHandler}
                        />
                        <div
                            id='search-spinner'
                            aria-hidden
                            hidden={!searching}
                        />
                        <div
                            className='sr-only'
                            aria-live='polite'
                        />
                    </Form>
                    <Form method="post">
                        <button type='submit'>New</button>
                    </Form>
                </div>
                <nav>
                    {contacts.length ? (
                        <ul>
                            {contacts.map((contact: Contact) => (
                                <li key={contact.id}>
                                    <NavLink
                                        to={`contacts/${contact.id}`}
                                        className={({ isActive, isPending }) =>
                                            isActive
                                                ? "active"
                                                : isPending
                                                    ? "pending"
                                                    : ""
                                        }
                                    >
                                        {contact.first || contact.last ? (
                                            <>
                                                {contact.first} {contact.last}
                                            </>
                                        ) : (
                                            <i>No Name</i>
                                        )}{" "}
                                        {contact.favorite && <span>★</span>}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>
                            <i>No contacts</i>
                        </p>
                    )}
                </nav>
            </div>
            <div
                id="detail"
                className={
                    navigation.state === 'loading' ? 'loading' : ''
                }
            >
                <Outlet />
            </div>
        </>
    );
};

export async function loader({ request }: { request: Request; }): Promise<RootLoaderReturnType> {
    const url = new URL(request.url);
    const q: string | null = url.searchParams.get('q');
    const contacts = await getContacts(q as string);
    return { contacts, q };
}

export async function action(): Promise<Response> {
    const contact: Contact = await createContact();
    return redirect(`/contacts/${contact.id}/edit`);
}

export default Root;