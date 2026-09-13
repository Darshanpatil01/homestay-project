package com.homestay.application.dto.response;

public class UploadResponse {

    private String fileName;
    private String folder;
    private String relativePath;
    private String url;
    private String contentType;
    private Long size;

    public UploadResponse() {
    }

    public UploadResponse(
            String fileName,
            String folder,
            String relativePath,
            String url,
            String contentType,
            Long size
    ) {
        this.fileName = fileName;
        this.folder = folder;
        this.relativePath = relativePath;
        this.url = url;
        this.contentType = contentType;
        this.size = size;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFolder() {
        return folder;
    }

    public void setFolder(String folder) {
        this.folder = folder;
    }

    public String getRelativePath() {
        return relativePath;
    }

    public void setRelativePath(String relativePath) {
        this.relativePath = relativePath;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }
}