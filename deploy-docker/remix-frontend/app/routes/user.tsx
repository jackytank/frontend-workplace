/* eslint-disable @typescript-eslint/no-unused-vars */
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

const HOST = import.meta.env.VITE_MY_HOST as string;
const actionName = '_action';
enum ReqEnum {
    CREATE = 'create',
    DELETE = 'delete'
}

export const loader = async ({
    request
}: LoaderFunctionArgs) => {
    const res = await fetch(`${HOST}/users`);
    const data: UserType[] = await res.json();
    return json({
        users: data
    });
};

export const action = async ({
    request
}: ActionFunctionArgs) => {
    const formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData);
    if (_action === ReqEnum.CREATE) {
        await fetch(`${HOST}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        });
    } else if (_action === ReqEnum.DELETE) {
        await fetch(`${HOST}/users/${values.id}`, {
            method: 'DELETE'
        });
    }
    return null;
};


const User = () => {
    // get loader data with types
    const { users } = useLoaderData<typeof loader>();

    return (
        <main>
            <h1>Users</h1>
            <ul>
                {users.length > 0 ? (
                    users.map((user) => (
                        <li key={user.id}>
                            {user.name} | {user.email} {' '}
                            <Form
                                style={{ display: 'inline' }}
                                method="post"
                            >
                                <input type="hidden" name="id" value={user.id} />
                                <button
                                    type="submit"
                                    name={actionName}
                                    value={ReqEnum.DELETE}
                                >
                                    X
                                </button>
                            </Form>
                        </li>
                    ))
                ) : null}
                <li>
                    <Form method="post">
                        <input type="text" name="name" placeholder='name...' />
                        <input type="email" name="email" placeholder='email...' />
                        <button
                            type="submit"
                            name={actionName}
                            value={ReqEnum.CREATE}
                        >
                            Add
                        </button>
                    </Form>
                </li>
            </ul>
        </main>

    );
};


export default User;