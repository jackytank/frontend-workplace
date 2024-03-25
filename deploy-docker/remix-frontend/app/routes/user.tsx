/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import axios from 'axios';

const HOST = 'http://localhost:8080';
const actionName = '_action';
enum ReqEnum {
    CREATE = 'create',
    DELETE = 'delete'
}

export const loader = async ({
    request
}: LoaderFunctionArgs) => {
    const res = await fetch(`${HOST}/api/v1/users`);
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
    console.log('_action', _action);
    if (_action === ReqEnum.CREATE) {
        await axios.post(`${HOST}/api/v1/users`, values);
    } else if (_action === ReqEnum.DELETE) {
        await axios.delete(`${HOST}/api/v1/users/${values.id}`);
    }
    return null;
};


const User = () => {
    // get loader data with types
    const { users } = useLoaderData<typeof loader>();

    return (
        <main>
            <h1>Users</h1>
            {users.length ? (
                <ul>
                    {users.map((user) => (
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
                    ))}
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
            ) : null}
        </main>

    );
};


export default User;