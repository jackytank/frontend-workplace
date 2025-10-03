package com.example.sftp.models;

import java.io.Serial;
import java.io.Serializable;

import lombok.Data;

@Data
public class Student implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private int id;
    private String name;
    private int age;
}
