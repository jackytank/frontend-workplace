type DataLogsResponseType = {
    Envelope: {
        Header: string;
        Body: {
            getAllDataLogResponse: {
                dataLogs: {
                    dataLog: DataLogAllModel[]
                };
            };
        };
    };
};

export type DataLogAllModel = {
    id: number;
    logDate: string;
};