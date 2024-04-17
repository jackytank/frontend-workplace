/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import * as xml2js from 'xml2js';

const rawXml = `
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
    <SOAP-ENV:Header/>
    <SOAP-ENV:Body>
        <ns2:getAllDataLogResponse xmlns:ns2="http://www.example.com/my-soap">
            <ns2:dataLogs>
                <ns2:dataLog>
                    <ns2:logDate>2024-04-15T10:00:00.000+07:00</ns2:logDate>
                    <ns2:logLevel>INFO</ns2:logLevel>
                    <ns2:logMessage>Initial data load started</ns2:logMessage>
                    <ns2:logStatus>FAILURE</ns2:logStatus>
                </ns2:dataLog>
                <ns2:dataLog>
                    <ns2:logDate>2024-04-15T10:01:00.000+07:00</ns2:logDate>
                    <ns2:logLevel>INFO</ns2:logLevel>
                    <ns2:logMessage>Data load in progress</ns2:logMessage>
                    <ns2:logStatus>SUCCESS</ns2:logStatus>
                </ns2:dataLog>
                <ns2:dataLog>
                    <ns2:logDate>2024-04-15T10:02:00.000+07:00</ns2:logDate>
                    <ns2:logLevel>WARN</ns2:logLevel>
                    <ns2:logMessage>Data load taking longer than expected</ns2:logMessage>
                    <ns2:logStatus>FAILURE</ns2:logStatus>
                </ns2:dataLog>
                <ns2:dataLog>
                    <ns2:logDate>2024-04-15T10:03:00.000+07:00</ns2:logDate>
                    <ns2:logLevel>ERROR</ns2:logLevel>
                    <ns2:logMessage>Data load failed due to unexpected error</ns2:logMessage>
                    <ns2:logStatus>SUCCESS</ns2:logStatus>
                </ns2:dataLog>
            </ns2:dataLogs>
        </ns2:getAllDataLogResponse>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
`

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

const AnalysisPage = () => {
  const [dataLogs, setDataLogs] = useState<DataLogsResponseType | undefined>();
  const parser = new xml2js.Parser({
    trim: true,
    explicitArray: false,
    ignoreAttrs: true,
    tagNameProcessors: [xml2js.processors.stripPrefix],
  });
  const fetchSoapDataLogs = async () => {
    const soapEnvelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:my="http://www.example.com/my-soap">
      <soapenv:Header />
      <soapenv:Body>
        <my:getAllDataLogRequest></my:getAllDataLogRequest>
      </soapenv:Body>
    </soapenv:Envelope>
    `;
    try {
      const response = await axios.post('http://localhost:8080/ws', soapEnvelope, {
        headers: {
          'Content-Type': 'text/xml',
        },
      });
      return response.data;
    } catch (error) {
      return null;
    }
  };
  useEffect(() => {
    fetchSoapDataLogs().then((soapXmlRes) => {
      parser.parseString(soapXmlRes, (err, result) => {
        if (err) return;
        const data = JSON.stringify(result, null, 2);
        console.log('rawData', soapXmlRes);
        console.log('parsedData', data);
        setDataLogs(result as DataLogsResponseType);
      });
    });
  }, []);

  return (
    <>
      <h2>AnalysisPage</h2>
      <pre>{rawXml}</pre>
      <br />
      <pre>{JSON.stringify(dataLogs, null, 2)}</pre>
    </>
  );
};

export default AnalysisPage;