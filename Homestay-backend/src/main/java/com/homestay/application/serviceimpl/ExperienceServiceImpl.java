package com.homestay.application.serviceimpl;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.homestay.application.dto.request.ExperienceRequest;
import com.homestay.application.dto.response.ExperienceResponse;
import com.homestay.application.mapper.ExperienceMapper;
import com.homestay.application.service.IExperienceService;
import com.homestay.domain.entity.Experience;
import com.homestay.infrastructure.repository.ExperienceRepository;

@Service
@Transactional
public class ExperienceServiceImpl
        implements IExperienceService {

    private final ExperienceRepository experienceRepository;

    public ExperienceServiceImpl(
            ExperienceRepository experienceRepository
    ) {
        this.experienceRepository = experienceRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExperienceResponse> getPublicExperiences() {
        return experienceRepository
                .findByActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(ExperienceMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ExperienceResponse getPublicExperienceById(
            Long id
    ) {
        Experience experience = getExperienceEntity(id);

        if (!Boolean.TRUE.equals(experience.getActive())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Experience not found."
            );
        }

        return ExperienceMapper.toResponse(experience);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExperienceResponse>
            getAllExperiencesForClient() {

        return experienceRepository
                .findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(ExperienceMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ExperienceResponse getExperienceByIdForClient(
            Long id
    ) {
        Experience experience = getExperienceEntity(id);

        return ExperienceMapper.toResponse(experience);
    }

    @Override
    public ExperienceResponse createExperience(
            ExperienceRequest request
    ) {
        String experienceTitle = request.getTitle().trim();

        if (experienceRepository.existsByTitleIgnoreCase(
                experienceTitle
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "An experience with this title already exists."
            );
        }

        Experience experience =
                ExperienceMapper.toEntity(request);

        Experience savedExperience =
                experienceRepository.save(experience);

        return ExperienceMapper.toResponse(savedExperience);
    }

    @Override
    public ExperienceResponse updateExperience(
            Long id,
            ExperienceRequest request
    ) {
        Experience experience = getExperienceEntity(id);

        String experienceTitle = request.getTitle().trim();

        if (experienceRepository
                .existsByTitleIgnoreCaseAndIdNot(
                        experienceTitle,
                        id
                )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "An experience with this title already exists."
            );
        }

        ExperienceMapper.updateEntity(
                experience,
                request
        );

        Experience updatedExperience =
                experienceRepository.save(experience);

        return ExperienceMapper.toResponse(
                updatedExperience
        );
    }

    @Override
    public void deleteExperience(Long id) {
        Experience experience = getExperienceEntity(id);

        experienceRepository.delete(experience);
    }

    private Experience getExperienceEntity(Long id) {
        return experienceRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Experience not found with ID: " + id
                        )
                );
    }
}