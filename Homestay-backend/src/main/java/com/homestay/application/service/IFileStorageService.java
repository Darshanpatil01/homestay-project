package com.homestay.application.service;

import org.springframework.web.multipart.MultipartFile;

import com.homestay.application.dto.response.UploadResponse;

public interface IFileStorageService {

    UploadResponse uploadImage(
            MultipartFile file,
            String folder
    );

    void deleteImage(
            String folder,
            String fileName
    );
}