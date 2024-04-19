package com.example.demo.enpoint;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;

import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import com.example.demo.config.Constants;
import com.example.demo.model.gen.GetAllDataLogRequest;
import com.example.demo.model.gen.GetAllDataLogResponse;
import com.example.demo.model.gen.GetDataLogDetailRequest;
import com.example.demo.model.gen.GetDataLogDetailResponse;
import com.example.demo.service.DataLogService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Endpoint
public class DataLogEnpoint {

    private final DataLogService dataLogService;

    // for request all data logs
    @PayloadRoot(namespace = Constants.NAMESPACE_URI, localPart = "getAllDataLogRequest")
    @ResponsePayload
    public GetAllDataLogResponse getAllDataLogs(@RequestPayload GetAllDataLogRequest getAllDataLogRequest) {
        System.out.println("getAllDataLogs called");
        var response = new GetAllDataLogResponse();
        response.setDataLogs(dataLogService.getAllDataLogs());
        return response;
    }

    // for detail request data log by id
    @PayloadRoot(namespace = Constants.NAMESPACE_URI, localPart = "getDataLogDetailRequest")
    @ResponsePayload
    public GetDataLogDetailResponse getDataLog(@RequestPayload GetDataLogDetailRequest getDataLogDetailRequest) {
        System.out.println("getDataLog called: " + getDataLogDetailRequest.getDataLogId());
        var response = new GetDataLogDetailResponse();
        response.setDetailDataLog(dataLogService.getDetailDataLogById(getDataLogDetailRequest.getDataLogId()));
        return response;
    }

}
