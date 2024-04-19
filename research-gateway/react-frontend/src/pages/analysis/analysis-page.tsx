/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Col, Modal, Row, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as xml2js from 'xml2js';
import { RootState } from "../../redux/store";
import { setDataLogs } from "../../redux/slice/analysis-slice";
import { constants } from "../../constants/constants";
import { axiosClient } from "../../api/axiosClient";
import { DataLogAllModel, DataLogsResponseType } from "../../types/analysis";
import { ColumnType } from "antd/es/table";

const rawXml = `
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
    <SOAP-ENV:Header/>
    <SOAP-ENV:Body>
        <ns2:getAllDataLogResponse xmlns:ns2="http://www.example.com/my-soap">
            <ns2:dataLogs>
                <ns2:dataLog>
                    <ns2:id>1</ns2:id>
                    <ns2:logDate>2024-04-15T10:00:00.000+07:00</ns2:logDate>
                </ns2:dataLog>
                <ns2:dataLog>
                    <ns2:id>2</ns2:id>
                    <ns2:logDate>2024-04-15T10:01:00.000+07:00</ns2:logDate>
                </ns2:dataLog>
                <ns2:dataLog>
                    <ns2:id>3</ns2:id>
                    <ns2:logDate>2024-04-15T10:02:00.000+07:00</ns2:logDate>
                </ns2:dataLog>
                <ns2:dataLog>
                    <ns2:id>4</ns2:id>
                    <ns2:logDate>2024-04-15T10:03:00.000+07:00</ns2:logDate>
                </ns2:dataLog>
            </ns2:dataLogs>
        </ns2:getAllDataLogResponse>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
`;


const AnalysisPage = () => {
  const dispatch = useDispatch();
  const { dataLogs } = useSelector((state: RootState) => state.analysis);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detailDataLog, setDetailDataLog] = useState(null);

  const showModal = (dataLogId: number) => {
    // Construct SOAP request for detail log
    console.log('dataLogId', dataLogId);
    const soapEnvelope = `
        <soapenv:Envelope
            xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:my="http://www.example.com/my-soap"
        >
            <soapenv:Header />
            <soapenv:Body>
                <my:getDataLogDetailRequest>
                    <my:dataLogId>${dataLogId}</my:dataLogId>
                </my:getDataLogDetailRequest>
            </soapenv:Body>
        </soapenv:Envelope>
    `;

    axiosClient.post(`${constants.API.WS_PATH}`, soapEnvelope).then((response) => {
      parser.parseString(response.data, (err, result) => {
        if (err) return;
        setDetailDataLog(result);
        setIsModalVisible(true);
      });
    }).catch((error) => {
      console.error('Error fetching detail log:', error);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns: ColumnType<DataLogAllModel>[] = [
    {
      title: 'Log ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Log Date',
      dataIndex: 'logDate',
      key: 'logDate',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_text, record) => (
        <Button onClick={() => showModal(record.id)}>Show detail log</Button>
      ),
    },
  ];

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
      const response = await axiosClient.post(`${constants.API.WS_PATH}`, soapEnvelope);
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
        dispatch(setDataLogs(result as DataLogsResponseType));
      });
    });
  }, []);

  return (
    <>
      <h2>AnalysisPage</h2>
      <Row gutter={[32, 32]} justify={'space-between'}>
        <Col span={9}>
          <h3>Raw XML</h3>
          <pre>{rawXml}</pre>
        </Col>
        <Col span={9}>
          <h3>Parsed XML -&gt; JSON</h3>
          <pre>{JSON.stringify(dataLogs, null, 2)}</pre>
        </Col>
      </Row>
      <hr />
      <Table columns={columns} dataSource={dataLogs?.Envelope.Body.getAllDataLogResponse.dataLogs.dataLog} />
      <Modal
        title="Detail Data Log"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
        ]}
      >
        <pre>{JSON.stringify(detailDataLog, null, 2)}</pre>
      </Modal>
    </>
  );
};

export default AnalysisPage;