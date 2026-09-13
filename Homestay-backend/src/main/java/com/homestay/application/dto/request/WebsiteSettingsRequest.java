package com.homestay.application.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class WebsiteSettingsRequest {

    @NotBlank(message = "Website name is required.")
    @Size(max = 100)
    private String websiteName;

    @NotBlank(message = "Sign-in label is required.")
    @Size(max = 100)
    private String signInLabel;

    @NotBlank(message = "Client button label is required.")
    @Size(max = 100)
    private String clientButtonLabel;

    @NotBlank(message = "Hero small title is required.")
    @Size(max = 200)
    private String heroSmallTitle;

    @NotBlank(message = "Hero title is required.")
    @Size(max = 250)
    private String heroTitle;

    @Size(max = 250)
    private String heroHighlightedText;

    @NotBlank(message = "Hero description is required.")
    private String heroDescription;

    private String heroImage;

    @NotBlank(message = "Footer description is required.")
    private String footerDescription;

    @Email(message = "Enter a valid contact email.")
    @Size(max = 150)
    private String contactEmail;

    @Size(max = 30)
    private String contactPhone;

    @Size(max = 250)
    private String contactAddress;

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
}