/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import axios from 'axios';

export const loader = async ({
    request
}: LoaderFunctionArgs) => {
    const res = await fetch('http://localhost:8080/api/v1/users/1');
    const data: UserType = await res.json();
    console.log('data', data);
    return json({
        user: data
    });
};

export const action = async ({
    request
}: ActionFunctionArgs) => {
    const formData = await request.formData();
    // send PUT request to update via axios
    await axios.put('http://localhost:8080/api/v1/users/1', {
        name: formData.get('name'),
        email: formData.get('email')
    });
    return null;
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


export default User;