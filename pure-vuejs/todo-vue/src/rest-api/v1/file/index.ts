import { BaseResponse } from "../hello";
import { Request, Response } from "express";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
import { SettingType } from "../../../types/global";

export type RequestBody = {
    userId: string;
    content: SettingType;
};

export const defaultRequestBody: RequestBody = {
    userId: 'system',
    content: {
        "MyUserSetting": {
            "name": "MyUser",
            "private": true,
            "StartMonth": 2
        }
    }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const POST = (req: Request, res: Response, next: any) => {
    const reqBody = req.body as RequestBody;
    const userId = reqBody.userId;
    const content = reqBody.content;
    console.log('userId:', userId);
    console.log('req.body:', req.body);
    const filePath = path.join(__dirname, '../../../../public/resources/user', userId, 'setting.json');
    try {
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(path.join(__dirname, '../../../../public/resources/user', userId), { recursive: true });
            fs.writeFileSync(filePath, JSON.stringify(content, null, 4));
        } else {
            const data = fs.readFileSync(filePath);
            const json = JSON.parse(data.toString()) as SettingType;
            const newJson = { ...json, ...content };
            fs.writeFileSync(filePath, JSON.stringify(newJson, null, 4));
        }
        const response: BaseResponse = {
            message: 'Success',
            data: null,
            status: 200
        };
        res.send(response);
    } catch (error) {
        const response: BaseResponse = {
            message: (error as Error).message,
            data: null,
            status: 500
        };
        res.send(response);
    }
};