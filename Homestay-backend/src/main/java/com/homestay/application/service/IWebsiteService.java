package com.homestay.application.service;

import com.homestay.application.dto.request.NavigationLinkRequest;
import com.homestay.application.dto.request.WebsiteSettingsRequest;
import com.homestay.application.dto.response.NavigationLinkResponse;
import com.homestay.application.dto.response.WebsiteSettingsResponse;

public interface IWebsiteService {

    WebsiteSettingsResponse getPublicWebsiteSettings();

    WebsiteSettingsResponse getWebsiteSettingsForClient();

    WebsiteSettingsResponse updateWebsiteSettings(
            WebsiteSettingsRequest request
    );

    NavigationLinkResponse createNavigationLink(
            NavigationLinkRequest request
    );

    NavigationLinkResponse updateNavigationLink(
            Long id,
            NavigationLinkRequest request
    );

    void deleteNavigationLink(Long id);
}