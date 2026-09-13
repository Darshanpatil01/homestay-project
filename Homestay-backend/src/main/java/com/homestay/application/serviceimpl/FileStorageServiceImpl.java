package com.homestay.application.serviceimpl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.homestay.application.dto.response.UploadResponse;
import com.homestay.application.service.IFileStorageService;

@Service
public class FileStorageServiceImpl
        implements IFileStorageService {

    private static final Set<String> ALLOWED_FOLDERS =
            Set.of(
                    "homestays",
                    "destinations",
                    "categories",
                    "experiences",
                    "testimonials",
                    "website",
                    "profiles"
            );

    private static final List<String> ALLOWED_CONTENT_TYPES =
            List.of(
                    "image/jpeg",
                    "image/png",
                    "image/webp"
            );

    private final Path uploadRootDirectory;

    public FileStorageServiceImpl(
            @Value(
                    "${application.upload.directory:uploads}"
            )
            String uploadDirectory
    ) {
        try {
            this.uploadRootDirectory = Paths
                    .get(uploadDirectory)
                    .toAbsolutePath()
                    .normalize();

            Files.createDirectories(
                    this.uploadRootDirectory
            );
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Could not initialize upload directory.",
                    exception
            );
        }
    }

    @Override
    public UploadResponse uploadImage(
            MultipartFile file,
            String folder
    ) {
        validateFolder(folder);
        validateFile(file);

        String originalFileName = StringUtils
                .cleanPath(
                        file.getOriginalFilename() != null
                                ? file.getOriginalFilename()
                                : "image"
                );

        String extension =
                getFileExtension(originalFileName);

        String generatedFileName =
                UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        + extension;

        try {
            Path folderPath = uploadRootDirectory
                    .resolve(folder)
                    .normalize();

            validateResolvedPath(folderPath);

            Files.createDirectories(folderPath);

            Path targetPath = folderPath
                    .resolve(generatedFileName)
                    .normalize();

            validateResolvedPath(targetPath);

            Files.copy(
                    file.getInputStream(),
                    targetPath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            String relativePath =
                    folder + "/" + generatedFileName;

            String fileUrl =
                    ServletUriComponentsBuilder
                            .fromCurrentContextPath()
                            .path("/uploads/")
                            .path(relativePath)
                            .toUriString();

            return new UploadResponse(
                    generatedFileName,
                    folder,
                    relativePath,
                    fileUrl,
                    file.getContentType(),
                    file.getSize()
            );
        } catch (IOException exception) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to store the uploaded image."
            );
        }
    }

    @Override
    public void deleteImage(
            String folder,
            String fileName
    ) {
        validateFolder(folder);

        if (!StringUtils.hasText(fileName)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "File name is required."
            );
        }

        String cleanFileName =
                StringUtils.cleanPath(fileName);

        if (cleanFileName.contains("..")
                || cleanFileName.contains("/")
                || cleanFileName.contains("\\")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid file name."
            );
        }

        try {
            Path filePath = uploadRootDirectory
                    .resolve(folder)
                    .resolve(cleanFileName)
                    .normalize();

            validateResolvedPath(filePath);

            if (!Files.exists(filePath)) {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Image file not found."
                );
            }

            Files.delete(filePath);
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (IOException exception) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to delete the image."
            );
        }
    }

    private void validateFolder(String folder) {
        if (!StringUtils.hasText(folder)
                || !ALLOWED_FOLDERS.contains(folder)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid upload folder."
            );
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Please select an image file."
            );
        }

        String contentType = file.getContentType();

        if (contentType == null
                || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only JPEG, PNG and WebP images are allowed."
            );
        }

        String originalFileName =
                file.getOriginalFilename();

        if (!StringUtils.hasText(originalFileName)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "The uploaded file must have a name."
            );
        }

        String cleanedName =
                StringUtils.cleanPath(originalFileName);

        if (cleanedName.contains("..")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid image file name."
            );
        }

        String extension = getFileExtension(cleanedName);

        if (!extension.equals(".jpg")
                && !extension.equals(".jpeg")
                && !extension.equals(".png")
                && !extension.equals(".webp")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Unsupported image extension."
            );
        }
    }

    private String getFileExtension(String fileName) {
        int finalDotIndex = fileName.lastIndexOf(".");

        if (finalDotIndex < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Image file extension is required."
            );
        }

        return fileName
                .substring(finalDotIndex)
                .toLowerCase();
    }

    private void validateResolvedPath(Path path) {
        if (!path.startsWith(uploadRootDirectory)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid upload path."
            );
        }
    }
}