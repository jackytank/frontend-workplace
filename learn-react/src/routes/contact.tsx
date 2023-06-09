import { FC } from "react";
import { Form, useLoaderData, redirect } from "react-router-dom";
import { getContact } from "../contacts";

const Contact = () => {
    const { contact } = useLoaderData() as { contact: ContactType; };

    const handleFormConfirmDelete = (event: React.FormEvent<HTMLFormElement>): void => {
        if (!confirm("Please confirm you want to delete this record")) {
            event.preventDefault();
        }
    };

    return (
        <div id="contact">
            <div>
                <img key={contact.avatar} src={contact.avatar ??= ""} />
            </div>

            <div>
                <h1>
                    {contact.first || contact.last ? (
                        <>
                            {contact.first} {contact.last}
                        </>
                    ) : (
                        <i>No Name</i>
                    )}{" "}
                    <Favorite contact={contact} />
                </h1>

                {contact.twitter && (
                    <p>
                        <a
                            target="_blank"
                            href={`https://twitter.com/${contact.twitter}`}
                        >
                            {contact.twitter}
                        </a>
                    </p>
                )}

                {contact.notes && <p>{contact.notes}</p>}

                <div>
                    <Form action="edit">
                        <button type="submit">Edit</button>
                    </Form>
                    <Form
                        method="post"
                        action="destroy"
                        onSubmit={handleFormConfirmDelete}
                    >
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

const Favorite: FC<ContactProps> = ({ contact }) => {
    const favorite = contact.favorite;
    return (
        <Form method="post">
            <button
                name="favorite"
                value={favorite ? "false" : "true"}
                aria-label={
                    favorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                }
            >
                {favorite ? "★" : "☆"}
            </button>
        </Form>
    );
};

interface ContactParam {
    contactId: string;
}

export const loader = async ({ params }: { params: ContactParam; }): Promise<{ contact: Contact | null; }> => {
    const contact: Contact | null = await getContact(params.contactId);
    return { contact };
};

export default Contact;
