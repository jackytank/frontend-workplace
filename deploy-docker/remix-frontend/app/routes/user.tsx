/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

export const loader = async ({
    request
}: LoaderFunctionArgs) => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users/1');
    const data: UserType = await res.json();
    return json({
        user: data
    });
};

const User = () => {
    // get loader data with types
    const { user } = useLoaderData<typeof loader>();

    return (
        <div>
            <h1>Form</h1>
            <Form method="post" action="/user">
                <h1>Settings for {user.name}</h1>
                <input
                    name="name"
                    defaultValue={user.name}
                />
                <br />
                <input
                    name="email"
                    defaultValue={user.email}
                />
                <br />
                <button type="submit">Save</button>
            </Form>
        </div>
    );
};

export const action = async ({
    request
}: ActionFunctionArgs) => {
    const formData = await request.formData();
    console.log('formData', Object.fromEntries(formData));
    const res = await fetch('https://jsonplaceholder.typicode.com/users/1', {
        method: 'PUT',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
            'Content-Type': 'application/json; chartset=UTF-8'
        }
    });
    const updatedUser = await res.json();
    return json({
        user: updatedUser,
        status: res.status,
        message: 'User updated successfully!'
    });
};

export default User;