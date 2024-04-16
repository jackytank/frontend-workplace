package com.example.demo.enpoint;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;

import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import com.example.demo.model.gen.DataLogModel;
import com.example.demo.model.gen.GetDataLogRequest;
import com.example.demo.model.gen.GetDataLogResponse;
import com.example.demo.service.DataLogService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Endpoint
public class DataLogEnpoint {
    private static final String NAMESPACE_URI = "http://www.baeldung.com/springsoap/gen";

    private final DataLogService dataLogService;

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getDataLogRequest")
    @ResponsePayload
    public GetDataLogResponse handleDataLogRequest(@RequestPayload GetDataLogRequest getDataLogRequest)
            throws DatatypeConfigurationException {
        var response = new GetDataLogResponse();
        var dataLog = new DataLogModel();
        // Create a DatatypeFactory instance
        DatatypeFactory datatypeFactory = DatatypeFactory.newInstance();
        // Create a mock XMLGregorianCalendar for the arrivalTime field
        XMLGregorianCalendar departTime = datatypeFactory.newXMLGregorianCalendar("2024-04-19T12:00:00");
        XMLGregorianCalendar arrivalTime = datatypeFactory.newXMLGregorianCalendar("2024-04-20T12:00:00");
        // Create a response object
        dataLog.setDepartTime(departTime);
        dataLog.setArrivalTime(arrivalTime);
        response.setDataLog(dataLog);
        System.out.println("GetDataLogRequest called: " + getDataLogRequest.getTrainId());
        return response;
    }
}
