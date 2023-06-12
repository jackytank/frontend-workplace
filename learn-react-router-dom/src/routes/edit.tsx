import { Form, useLoaderData, redirect, useNavigation, useNavigate } from 'react-router-dom';
import { updateContact } from "../contacts";

const EditContact = () => {
    const { contact } = useLoaderData() as { contact: ContactType; };
    const navigation = useNavigation();
    const navigate = useNavigate();

    return (
        <Form method='post' id='contact-form'>
            <p>
                <span>Name</span>
                <input
                    placeholder='First'
                    aria-label='First Name'
                    type='text'
                    name='first'
                    defaultValue={contact.first}
                />
                <input
                    placeholder='Last'
                    aria-label='Last Name'
                    type='text'
                    name='last'
                    defaultValue={contact.last}
                />
            </p>
            <label>
                <span>Twitter</span>
                <input
                    type='text'
                    name='twitter'
                    placeholder='@jack'
                    defaultValue={contact.twitter}
                />
            </label>
            <label>
                <span>Avatar URL</span>
                <input
                    placeholder="https://example.com/avatar.jpg"
                    aria-label="Avatar URL"
                    type="text"
                    name="avatar"
                    defaultValue={contact.avatar}
                />
            </label>
            <label>
                <span>Notes</span>
                <textarea
                    name="notes"
                    defaultValue={contact.notes}
                    rows={6}
                />
            </label>
            <p>
                <button
                    type="submit"
                >
                    {navigation.state === 'submitting'
                        ? 'Saving...'
                        : 'Save'}
                </button>
                <button
                    type='button'
                    onClick={() => {
                        navigate(-1);
                    }}
                >
                    Cancel
                </button>
            </p>
        </Form>
    );
};

export async function action({ request, params }: { request: Request, params: ParamsType; }): Promise<Response> {
    const formData = await request.formData();
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    console.log(`${firstName} ${lastName}`);

    const updates = Object.fromEntries(formData);
    await updateContact(params.contactId, updates);
    return redirect(`/contacts/${params.contactId}`);
}

export default EditContact;