package com.homestay.infrastructure.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final String uploadDirectory;

    public WebConfig(
            @Value(
                    "${application.upload.directory:uploads}"
            )
            String uploadDirectory
    ) {
        this.uploadDirectory = uploadDirectory;
    }

    @Override
    public void addResourceHandlers(
            ResourceHandlerRegistry registry
    ) {
        Path uploadPath = Paths
                .get(uploadDirectory)
                .toAbsolutePath()
                .normalize();

        String resourceLocation =
                uploadPath.toUri().toString();

        registry
                .addResourceHandler("/uploads/**")
                .addResourceLocations(resourceLocation);
    }
}