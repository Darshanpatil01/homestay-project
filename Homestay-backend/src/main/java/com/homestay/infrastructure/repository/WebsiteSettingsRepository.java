package com.homestay.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.homestay.domain.entity.WebsiteSettings;

public interface WebsiteSettingsRepository
        extends JpaRepository<WebsiteSettings, Long> {
}