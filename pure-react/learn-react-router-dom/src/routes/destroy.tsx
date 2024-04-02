import { redirect } from "react-router-dom";
import { deleteContact } from "../contacts";

export const action = async ({ params }: { params: ParamsType; }): Promise<Response> => {
    // throw new Error('Oh Shiwt! Err');
    await deleteContact(params.contactId);
    return redirect('/');
};