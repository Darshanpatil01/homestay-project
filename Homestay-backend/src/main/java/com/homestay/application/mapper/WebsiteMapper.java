package com.homestay.application.mapper;

import com.homestay.application.dto.request.NavigationLinkRequest;
import com.homestay.application.dto.request.WebsiteSettingsRequest;
import com.homestay.application.dto.response.NavigationLinkResponse;
import com.homestay.application.dto.response.WebsiteSettingsResponse;
import com.homestay.domain.entity.NavigationLink;
import com.homestay.domain.entity.WebsiteSettings;

public final class WebsiteMapper {

    private WebsiteMapper() {
    }

    public static void updateSettings(
            WebsiteSettings settings,
            WebsiteSettingsRequest request
    ) {
        settings.setWebsiteName(request.getWebsiteName().trim());
        settings.setSignInLabel(request.getSignInLabel().trim());
        settings.setClientButtonLabel(
                request.getClientButtonLabel().trim()
        );
        settings.setHeroSmallTitle(
                request.getHeroSmallTitle().trim()
        );
        settings.setHeroTitle(request.getHeroTitle().trim());
        settings.setHeroHighlightedText(
                request.getHeroHighlightedText()
        );
        settings.setHeroDescription(
                request.getHeroDescription().trim()
        );
        settings.setHeroImage(request.getHeroImage());
        settings.setFooterDescription(
                request.getFooterDescription().trim()
        );
        settings.setContactEmail(request.getContactEmail());
        settings.setContactPhone(request.getContactPhone());
        settings.setContactAddress(request.getContactAddress());
    }

    public static void updateNavigationLink(
            NavigationLink link,
            NavigationLinkRequest request
    ) {
        link.setLabel(request.getLabel().trim());
        link.setPath(request.getPath().trim());

        link.setDisplayOrder(
                request.getDisplayOrder() != null
                        ? request.getDisplayOrder()
                        : 0
        );

        link.setActive(
                request.getActive() != null
                        ? request.getActive()
                        : true
        );
    }

    public static NavigationLinkResponse toLinkResponse(
            NavigationLink link
    ) {
        NavigationLinkResponse response =
                new NavigationLinkResponse();

        response.setId(link.getId());
        response.setLabel(link.getLabel());
        response.setPath(link.getPath());
        response.setDisplayOrder(link.getDisplayOrder());
        response.setActive(link.getActive());

        return response;
    }

    public static WebsiteSettingsResponse toSettingsResponse(
            WebsiteSettings settings
    ) {
        WebsiteSettingsResponse response =
                new WebsiteSettingsResponse();

        response.setId(settings.getId());
        response.setWebsiteName(settings.getWebsiteName());
        response.setSignInLabel(settings.getSignInLabel());
        response.setClientButtonLabel(
                settings.getClientButtonLabel()
        );
        response.setHeroSmallTitle(settings.getHeroSmallTitle());
        response.setHeroTitle(settings.getHeroTitle());
        response.setHeroHighlightedText(
                settings.getHeroHighlightedText()
        );
        response.setHeroDescription(
                settings.getHeroDescription()
        );
        response.setHeroImage(settings.getHeroImage());
        response.setFooterDescription(
                settings.getFooterDescription()
        );
        response.setContactEmail(settings.getContactEmail());
        response.setContactPhone(settings.getContactPhone());
        response.setContactAddress(settings.getContactAddress());
        response.setCreatedAt(settings.getCreatedAt());
        response.setUpdatedAt(settings.getUpdatedAt());

        return response;
    }
}