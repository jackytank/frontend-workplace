type DataLogsResponseType = {
    Envelope: {
        Header: string;
        Body: {
            getAllDataLogResponse: {
                dataLogs: {
                    dataLog: Array<{
                        logDate: string;
                        logLevel: string;
                        logMessage: string;
                        logStatus: string;
                    }>;
                };
            };
        };
    };
};