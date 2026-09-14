package com.homestay.infrastructure.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final String frontendUrl;
    private final String uploadDirectory;

    public WebConfig(
            @Value("${application.frontend.url}") String frontendUrl,
            @Value("${application.upload.directory}") String uploadDirectory) {

        this.frontendUrl = removeTrailingSlash(frontendUrl);
        this.uploadDirectory = uploadDirectory;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/api/**")
                .allowedOrigins(
                        "http://localhost:5173",
                        frontendUrl
                )
                .allowedMethods(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
                .allowedHeaders("*")
                .exposedHeaders("Authorization")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(
            ResourceHandlerRegistry registry) {

        Path uploadPath = Paths.get(uploadDirectory)
                .toAbsolutePath()
                .normalize();

        String uploadLocation =
                uploadPath.toUri().toString();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadLocation);
    }

    private String removeTrailingSlash(String url) {

        if (url == null || url.isBlank()) {
            return "http://localhost:5173";
        }

        String normalizedUrl = url.trim();

        while (normalizedUrl.endsWith("/")) {
            normalizedUrl = normalizedUrl.substring(
                    0,
                    normalizedUrl.length() - 1
            );
        }

        return normalizedUrl;
    }
}