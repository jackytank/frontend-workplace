/* eslint-disable prettier/prettier */
import { NextFunction, Request, Response } from 'express';
import puppeteer, { Browser, Page } from 'puppeteer';

type TableType = {
    id: string;
    className: string;
    headers: string[];
    rows: (string | string[])[][];
};


export class ScrapperController {
    public getScrapping = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const webUrl = req.query.webUrl as string;
            if (!webUrl) {
                res.status(400).json({ message: 'Please provide a webUrl as requestParam' });
                return;
            }
            const browser: Browser = await puppeteer.launch({ headless: true });
            const page: Page = await browser.newPage();
            await page.goto(webUrl, { waitUntil: 'networkidle2' });

            const data: TableType[] = await page.evaluate(() => {
                const delNewLineTxt = (text: string | null | undefined): string => text?.replace(/\n/g, '').trim() || '';
                const tables = Array.from(document.querySelectorAll('table')) as HTMLTableElement[];
                return tables.map((table) => {
                    const headers = Array.from(table.querySelectorAll('thead > tr > th')).map((header) => header.textContent?.trim() || '');
                    const rows = Array.from(table.querySelectorAll('tbody > tr')).map((row) => {
                        return Array.from(row.querySelectorAll('td')).map((cell) => {
                            // Check for img tags inside the cell
                            const images = Array.from(cell.querySelectorAll('img')).map((img) => img.src);
                            // If there are images, return an array of image sources, otherwise return the cell text
                            return images.length > 0 ? images : delNewLineTxt(cell.textContent);
                        });
                    });
                    return { id: table.id, className: table.className, headers, rows };
                });
            });

            await browser.close();

            res.status(200).json({ message: webUrl, data: data });
        } catch (error) {
            next(error);
        }
    };
}

