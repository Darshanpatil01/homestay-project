package com.homestay.application.serviceimpl;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.homestay.application.dto.request.NavigationLinkRequest;
import com.homestay.application.dto.request.WebsiteSettingsRequest;
import com.homestay.application.dto.response.NavigationLinkResponse;
import com.homestay.application.dto.response.WebsiteSettingsResponse;
import com.homestay.application.mapper.WebsiteMapper;
import com.homestay.application.service.IWebsiteService;
import com.homestay.domain.entity.NavigationLink;
import com.homestay.domain.entity.WebsiteSettings;
import com.homestay.infrastructure.repository.NavigationLinkRepository;
import com.homestay.infrastructure.repository.WebsiteSettingsRepository;

@Service
@Transactional
public class WebsiteServiceImpl implements IWebsiteService {

    private final WebsiteSettingsRepository settingsRepository;
    private final NavigationLinkRepository navigationRepository;

    public WebsiteServiceImpl(
            WebsiteSettingsRepository settingsRepository,
            NavigationLinkRepository navigationRepository
    ) {
        this.settingsRepository = settingsRepository;
        this.navigationRepository = navigationRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public WebsiteSettingsResponse getPublicWebsiteSettings() {
        WebsiteSettings settings = getSettings();

        WebsiteSettingsResponse response =
                WebsiteMapper.toSettingsResponse(settings);

        List<NavigationLinkResponse> links =
                navigationRepository
                        .findByActiveTrueOrderByDisplayOrderAsc()
                        .stream()
                        .map(WebsiteMapper::toLinkResponse)
                        .toList();

        response.setNavigationLinks(links);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public WebsiteSettingsResponse getWebsiteSettingsForClient() {
        WebsiteSettings settings = getSettings();

        WebsiteSettingsResponse response =
                WebsiteMapper.toSettingsResponse(settings);

        List<NavigationLinkResponse> links =
                navigationRepository
                        .findAllByOrderByDisplayOrderAsc()
                        .stream()
                        .map(WebsiteMapper::toLinkResponse)
                        .toList();

        response.setNavigationLinks(links);

        return response;
    }

    @Override
    public WebsiteSettingsResponse updateWebsiteSettings(
            WebsiteSettingsRequest request
    ) {
        WebsiteSettings settings = getSettings();

        WebsiteMapper.updateSettings(settings, request);

        WebsiteSettings savedSettings =
                settingsRepository.save(settings);

        WebsiteSettingsResponse response =
                WebsiteMapper.toSettingsResponse(savedSettings);

        response.setNavigationLinks(
                navigationRepository
                        .findAllByOrderByDisplayOrderAsc()
                        .stream()
                        .map(WebsiteMapper::toLinkResponse)
                        .toList()
        );

        return response;
    }

    @Override
    public NavigationLinkResponse createNavigationLink(
            NavigationLinkRequest request
    ) {
        NavigationLink link = new NavigationLink();

        WebsiteMapper.updateNavigationLink(link, request);

        return WebsiteMapper.toLinkResponse(
                navigationRepository.save(link)
        );
    }

    @Override
    public NavigationLinkResponse updateNavigationLink(
            Long id,
            NavigationLinkRequest request
    ) {
        NavigationLink link = getNavigationLink(id);

        WebsiteMapper.updateNavigationLink(link, request);

        return WebsiteMapper.toLinkResponse(
                navigationRepository.save(link)
        );
    }

    @Override
    public void deleteNavigationLink(Long id) {
        NavigationLink link = getNavigationLink(id);

        navigationRepository.delete(link);
    }

    private WebsiteSettings getSettings() {
        return settingsRepository
                .findAll()
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Website settings have not been configured."
                        )
                );
    }

    private NavigationLink getNavigationLink(Long id) {
        return navigationRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Navigation link not found with ID: " + id
                        )
                );
    }
}