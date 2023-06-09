import { Outlet, useLoaderData, Form, redirect, NavLink, useNavigation } from "react-router-dom";
import { getContacts, createContact } from "../contacts";



const Root = () => {
    const { contacts } = useLoaderData() as { contacts: Contact[]; };
    const navigation = useNavigation();

    return (
        <>
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <div>
                    <form id='search-form' role='search'>
                        <input
                            id='q'
                            aria-label='Search contact'
                            placeholder='Search...'
                            type='search'
                            name='q'
                        />
                        <div
                            id='search-spinner'
                            aria-hidden
                            hidden={true}
                        />
                        <div
                            className='sr-only'
                            aria-live='polite'
                        />
                    </form>
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

export async function loader(): Promise<{ contacts: Contact[]; }> {
    const contacts: Contact[] = await getContacts(undefined);
    return { contacts };
}

export async function action(): Promise<Response> {
    const contact: Contact = await createContact();
    return redirect(`/contacts/${contact.id}/edit`);
}

export default Root;