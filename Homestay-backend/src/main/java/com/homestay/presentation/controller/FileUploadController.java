package com.homestay.presentation.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.homestay.application.dto.response.UploadResponse;
import com.homestay.application.service.IFileStorageService;

@RestController
@RequestMapping("/api/client/uploads")
public class FileUploadController {

    private final IFileStorageService fileStorageService;

    public FileUploadController(
            IFileStorageService fileStorageService
    ) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/{folder}")
    public ResponseEntity<UploadResponse> uploadImage(
            @PathVariable String folder,
            @RequestParam("file") MultipartFile file
    ) {
        UploadResponse response =
                fileStorageService.uploadImage(
                        file,
                        folder
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @DeleteMapping("/{folder}/{fileName}")
    public ResponseEntity<Void> deleteImage(
            @PathVariable String folder,
            @PathVariable String fileName
    ) {
        fileStorageService.deleteImage(
                folder,
                fileName
        );

        return ResponseEntity.noContent().build();
    }
}