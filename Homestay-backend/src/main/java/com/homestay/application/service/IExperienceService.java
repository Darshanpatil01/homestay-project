package com.homestay.application.service;

import java.util.List;

import com.homestay.application.dto.request.ExperienceRequest;
import com.homestay.application.dto.response.ExperienceResponse;

public interface IExperienceService {

    List<ExperienceResponse> getPublicExperiences();

    ExperienceResponse getPublicExperienceById(Long id);

    List<ExperienceResponse> getAllExperiencesForClient();

    ExperienceResponse getExperienceByIdForClient(Long id);

    ExperienceResponse createExperience(
            ExperienceRequest request
    );

    ExperienceResponse updateExperience(
            Long id,
            ExperienceRequest request
    );

    void deleteExperience(Long id);
}