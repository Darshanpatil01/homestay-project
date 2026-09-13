package com.homestay.application.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class WebsiteSettingsResponse {

    private Long id;
    private String websiteName;
    private String signInLabel;
    private String clientButtonLabel;
    private String heroSmallTitle;
    private String heroTitle;
    private String heroHighlightedText;
    private String heroDescription;
    private String heroImage;
    private String footerDescription;
    private String contactEmail;
    private String contactPhone;
    private String contactAddress;
    private List<NavigationLinkResponse> navigationLinks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWebsiteName() {
        return websiteName;
    }

    public void setWebsiteName(String websiteName) {
        this.websiteName = websiteName;
    }

    public String getSignInLabel() {
        return signInLabel;
    }

    public void setSignInLabel(String signInLabel) {
        this.signInLabel = signInLabel;
    }

    public String getClientButtonLabel() {
        return clientButtonLabel;
    }

    public void setClientButtonLabel(String clientButtonLabel) {
        this.clientButtonLabel = clientButtonLabel;
    }

    public String getHeroSmallTitle() {
        return heroSmallTitle;
    }

    public void setHeroSmallTitle(String heroSmallTitle) {
        this.heroSmallTitle = heroSmallTitle;
    }

    public String getHeroTitle() {
        return heroTitle;
    }

    public void setHeroTitle(String heroTitle) {
        this.heroTitle = heroTitle;
    }

    public String getHeroHighlightedText() {
        return heroHighlightedText;
    }

    public void setHeroHighlightedText(String heroHighlightedText) {
        this.heroHighlightedText = heroHighlightedText;
    }

    public String getHeroDescription() {
        return heroDescription;
    }

    public void setHeroDescription(String heroDescription) {
        this.heroDescription = heroDescription;
    }

    public String getHeroImage() {
        return heroImage;
    }

    public void setHeroImage(String heroImage) {
        this.heroImage = heroImage;
    }

    public String getFooterDescription() {
        return footerDescription;
    }

    public void setFooterDescription(String footerDescription) {
        this.footerDescription = footerDescription;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getContactAddress() {
        return contactAddress;
    }

    public void setContactAddress(String contactAddress) {
        this.contactAddress = contactAddress;
    }

    public List<NavigationLinkResponse> getNavigationLinks() {
        return navigationLinks;
    }

    public void setNavigationLinks(
            List<NavigationLinkResponse> navigationLinks
    ) {
        this.navigationLinks = navigationLinks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}