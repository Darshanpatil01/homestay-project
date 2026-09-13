package com.homestay.domain.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "website_settings")
public class WebsiteSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String websiteName;

    @Column(nullable = false, length = 100)
    private String signInLabel;

    @Column(nullable = false, length = 100)
    private String clientButtonLabel;

    @Column(nullable = false, length = 200)
    private String heroSmallTitle;

    @Column(nullable = false, length = 250)
    private String heroTitle;

    @Column(length = 250)
    private String heroHighlightedText;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String heroDescription;

    @Column(columnDefinition = "TEXT")
    private String heroImage;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String footerDescription;

    @Column(length = 150)
    private String contactEmail;

    @Column(length = 30)
    private String contactPhone;

    @Column(length = 250)
    private String contactAddress;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void beforeInsert() {
        LocalDateTime currentTime = LocalDateTime.now();

        createdAt = currentTime;
        updatedAt = currentTime;
    }

    @PreUpdate
    public void beforeUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}