import { Request, Response } from "express";

export type BaseResponse = {
    message: string;
    data: any;
    status: number;
}

export const GET = (req: Request, res: Response, next: any) => { 
    // res.send('Hello from vite-plugin-api-routes GET /rest-api/v1/hello'); 
    const response: BaseResponse = {
        message: 'Hello from vite-plugin-api-routes GET /rest-api/v1/hello',
        data: [
            {
                id: 1,
                name: 'John Doe'
            },
            {
                id: 2,
                name: 'Jane Doe'
            }
        ],
        status: 200
    };
    res.send(JSON.stringify(response));
};