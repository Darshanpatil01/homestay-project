package com.homestay.presentation.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.homestay.domain.entity.NavigationLink;
import com.homestay.domain.entity.WebsiteSettings;
import com.homestay.infrastructure.repository.NavigationLinkRepository;
import com.homestay.infrastructure.repository.WebsiteSettingsRepository;
import com.homestay.application.dto.request.NavigationLinkRequest;
import com.homestay.application.dto.request.WebsiteSettingsRequest;
import com.homestay.application.dto.response.NavigationLinkResponse;
import com.homestay.application.dto.response.WebsiteSettingsResponse;
import com.homestay.application.service.IWebsiteService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class WebsiteController {

    private final IWebsiteService websiteService;

    public WebsiteController(IWebsiteService websiteService) {
        this.websiteService = websiteService;
    }

    @GetMapping("/website/settings")
    public ResponseEntity<WebsiteSettingsResponse>
            getPublicWebsiteSettings() {

        return ResponseEntity.ok(
                websiteService.getPublicWebsiteSettings()
        );
    }

    @GetMapping("/client/website/settings")
    public ResponseEntity<WebsiteSettingsResponse>
            getWebsiteSettingsForClient() {

        return ResponseEntity.ok(
                websiteService.getWebsiteSettingsForClient()
        );
    }

    @PutMapping("/client/website/settings")
    public ResponseEntity<WebsiteSettingsResponse>
            updateWebsiteSettings(
                    @Valid
                    @RequestBody WebsiteSettingsRequest request
            ) {

        return ResponseEntity.ok(
                websiteService.updateWebsiteSettings(request)
        );
    }

    @PostMapping("/client/navigation-links")
    public ResponseEntity<NavigationLinkResponse>
            createNavigationLink(
                    @Valid
                    @RequestBody NavigationLinkRequest request
            ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        websiteService
                                .createNavigationLink(request)
                );
    }

    @PutMapping("/client/navigation-links/{id}")
    public ResponseEntity<NavigationLinkResponse>
            updateNavigationLink(
                    @PathVariable Long id,
                    @Valid
                    @RequestBody NavigationLinkRequest request
            ) {

        return ResponseEntity.ok(
                websiteService.updateNavigationLink(
                        id,
                        request
                )
        );
    }

    @DeleteMapping("/client/navigation-links/{id}")
    public ResponseEntity<Void> deleteNavigationLink(
            @PathVariable Long id
    ) {
        websiteService.deleteNavigationLink(id);

        return ResponseEntity.noContent().build();
    }
    private void createWebsiteSettings(
            WebsiteSettingsRepository repository
    ) {
        if (repository.count() > 0) {
            return;
        }

        WebsiteSettings settings = new WebsiteSettings();

        settings.setWebsiteName("StayNest");
        settings.setSignInLabel("Sign In");
        settings.setClientButtonLabel("List Your Property");
        settings.setHeroSmallTitle(
                "HANDPICKED HOMESTAYS ACROSS INDIA"
        );
        settings.setHeroTitle("Stay somewhere");
        settings.setHeroHighlightedText(
                "worth remembering."
        );
        settings.setHeroDescription(
                "Thoughtful homes, generous hosts and unforgettable experiences."
        );
        settings.setHeroImage(
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
        );
        settings.setFooterDescription(
                "Discover handpicked homestays, local experiences and welcoming hosts across India."
        );
        settings.setContactEmail("support@staynest.in");
        settings.setContactPhone("+91 98765 43210");
        settings.setContactAddress(
                "Mumbai, Maharashtra, India"
        );

        repository.save(settings);
    }

    private void createNavigationLinks(
            NavigationLinkRepository repository
    ) {
        if (repository.count() > 0) {
            return;
        }

        saveNavigationLink(repository, "Home", "/", 1);
        saveNavigationLink(
                repository,
                "Homestays",
                "/homestays",
                2
        );
        saveNavigationLink(
                repository,
                "Destinations",
                "/destinations",
                3
        );
        saveNavigationLink(
                repository,
                "Experiences",
                "/experiences",
                4
        );
        saveNavigationLink(repository, "About", "/about", 5);
        saveNavigationLink(
                repository,
                "Contact",
                "/contact",
                6
        );
    }

    private void saveNavigationLink(
            NavigationLinkRepository repository,
            String label,
            String path,
            int displayOrder
    ) {
        NavigationLink link = new NavigationLink();

        link.setLabel(label);
        link.setPath(path);
        link.setDisplayOrder(displayOrder);
        link.setActive(true);

        repository.save(link);
    }
}