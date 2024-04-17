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
import com.example.demo.model.gen.DataLogArray;
import com.example.demo.model.gen.DataLogModel;
import com.example.demo.repository.DataLogRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class DataLogService {

    private final DataLogRepository dataLogRepository;

    @Cacheable(value = "dataLogCache")
    public DataLogArray getAllDataLogs() {
        System.out.println("getAllDataLogs called");
        List<DataLog> dataLogs = dataLogRepository.findAll();
        List<DataLogModel> dataLogModels = mapDataLogsToDataLogModels(dataLogs);
        DataLogArray dataLogArray = new DataLogArray();
        dataLogArray.getDataLog().addAll(dataLogModels);
        return dataLogArray;
    }

    private List<DataLogModel> mapDataLogsToDataLogModels(List<DataLog> dataLogs) {
        return dataLogs.stream()
                .map(this::mapDataLogToDataLogModel)
                .collect(Collectors.toList());
    }

    private DataLogModel mapDataLogToDataLogModel(DataLog dataLog) {
        DataLogModel dataLogModel = new DataLogModel();
        dataLogModel.setLogDate(convertToXMLGregorianCalendar(dataLog.getLogDate()));
        dataLogModel.setLogLevel(dataLog.getLogLevel().name());
        dataLogModel.setLogMessage(dataLog.getLogMessage());
        dataLogModel.setLogStatus(dataLog.getLogStatus().name());
        return dataLogModel;
    }

    private XMLGregorianCalendar convertToXMLGregorianCalendar(LocalDateTime localDateTime) {
        try {
            GregorianCalendar gregorianCalendar = GregorianCalendar.from(localDateTime.atZone(ZoneId.systemDefault()));
            return DatatypeFactory.newInstance().newXMLGregorianCalendar(gregorianCalendar);
        } catch (DatatypeConfigurationException e) {
            throw new RuntimeException("Error converting LocalDateTime to XMLGregorianCalendar", e);
        }
    }
}
