package com.example.sftp;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;
import java.util.Properties;

import com.example.sftp.models.Student;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;

public class SftpDemo {
    public static void main(String[] args) {
        try {
            var sftpDemo = new SftpDemo();
            sftpDemo.uploadToSftp();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void uploadToSftp() throws JSchException, SftpException {
        final ChannelSftp channelSftp = setupSftp()
                .orElseThrow(() -> new RuntimeException("Failed to connect to SFTP server. Check connection details."));

        final String localFile = getClass().getClassLoader().getResource("students.json").getFile();
        System.out.println("Uploading file: " + localFile);
        final String remoteFilePath = "/srv/sftpuser/data/students.json";
        channelSftp.put(localFile, remoteFilePath);
        System.out.println("File uploaded successfully");
        channelSftp.disconnect();
        channelSftp.exit();
    }

    @SuppressWarnings("unused")
    private Optional<ChannelSftp> setupSftp() throws JSchException {
        // sftp connection details for localhost
        final String host = "localhost";
        final int port = 22;
        final String username = "sftpuser";
        final String password = "1221";
        // init
        JSch jsch = new JSch();
        Session session = jsch.getSession(username, host, port);
        Properties config = new Properties();
        config.put("StrictHostKeyChecking", "no");
        session.setPassword(password);
        session.setConfig(config);
        session.connect();
        ChannelSftp channel = (ChannelSftp) session.openChannel("sftp");
        if (channel == null) {
            return Optional.empty();
        }
        channel.connect();
        return Optional.of(channel);
    }

    @SuppressWarnings("unused")
    private void readAndParseJson() {
        // src/main/resources/students.json
        // read .json file and parse to array of Student objects using Gson
        // in jar environment
        var students = SftpDemo.class.getClassLoader().getResource("students.json");
        if (students == null) {
            System.out.println("students.json not found");
            return;
        }
        try {
            var json = Files.readString(Path.of(students.toURI()));
            var gson = new com.google.gson.Gson();
            var studentArray = gson.fromJson(json, Student[].class);
            for (var student : studentArray) {
                System.out.println(student);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
