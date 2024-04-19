package com.example.demo.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.stream.Collectors;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.example.demo.entity.DataLog;
import com.example.demo.model.gen.DataLogAllArray;
import com.example.demo.model.gen.DataLogAllModel;
import com.example.demo.model.gen.DataLogDetailModel;
import com.example.demo.repository.DataLogRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class DataLogService {

    private final DataLogRepository dataLogRepository;

    @Cacheable(value = "dataLogAllCache")
    public DataLogAllArray getAllDataLogs() {
        System.out.println("getAllDataLogs called");
        List<DataLog> dataLogs = dataLogRepository.findAll();
        List<DataLogAllModel> dataLogModels = mapDataLogsToDataLogAllModels(dataLogs);
        var dataLogArray = new DataLogAllArray();
        dataLogArray.getDataLog().addAll(dataLogModels);
        return dataLogArray;
    }

    private List<DataLogAllModel> mapDataLogsToDataLogAllModels(List<DataLog> dataLogs) {
        return dataLogs.stream()
                .map(e -> {
                    var dataLogModel = new DataLogAllModel();
                    dataLogModel.setId(e.getId());
                    dataLogModel.setLogDate(convertToXMLGregorianCalendar(e.getLogDate()));
                    return dataLogModel;
                })
                .collect(Collectors.toList());
    }

    private XMLGregorianCalendar convertToXMLGregorianCalendar(LocalDateTime localDateTime) {
        try {
            GregorianCalendar gregorianCalendar = GregorianCalendar.from(localDateTime.atZone(ZoneId.systemDefault()));
            return DatatypeFactory.newInstance().newXMLGregorianCalendar(gregorianCalendar);
        } catch (DatatypeConfigurationException e) {
            throw new RuntimeException("Error converting LocalDateTime to XMLGregorianCalendar", e);
        }
    }

    public DataLogDetailModel getDetailDataLogById(long id) {
        System.out.println("getDetailDataLogById::id called: " + id);
        var dataLog = dataLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Data log not found"));
        var detailDataLog = new DataLogDetailModel();
        detailDataLog.setLogDate(convertToXMLGregorianCalendar(dataLog.getLogDate()));
        detailDataLog.setLogLevel(dataLog.getLogLevel().name());
        detailDataLog.setLogMessage(dataLog.getLogMessage());
        detailDataLog.setLogStatus(dataLog.getLogStatus().name());
        return detailDataLog;
    }
}
