package com.homestay.presentation.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homestay.application.dto.request.ExperienceRequest;
import com.homestay.application.dto.response.ExperienceResponse;
import com.homestay.application.service.IExperienceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class ExperienceController {

    private final IExperienceService experienceService;

    public ExperienceController(
            IExperienceService experienceService
    ) {
        this.experienceService = experienceService;
    }

    // Public endpoints

    @GetMapping("/experiences")
    public ResponseEntity<List<ExperienceResponse>>
            getPublicExperiences() {

        return ResponseEntity.ok(
                experienceService.getPublicExperiences()
        );
    }

    @GetMapping("/experiences/{id}")
    public ResponseEntity<ExperienceResponse>
            getPublicExperienceById(
                    @PathVariable Long id
            ) {

        return ResponseEntity.ok(
                experienceService.getPublicExperienceById(id)
        );
    }

    // Client and Admin endpoints

    @GetMapping("/client/experiences")
    public ResponseEntity<List<ExperienceResponse>>
            getAllExperiencesForClient() {

        return ResponseEntity.ok(
                experienceService.getAllExperiencesForClient()
        );
    }

    @GetMapping("/client/experiences/{id}")
    public ResponseEntity<ExperienceResponse>
            getExperienceByIdForClient(
                    @PathVariable Long id
            ) {

        return ResponseEntity.ok(
                experienceService.getExperienceByIdForClient(id)
        );
    }

    @PostMapping("/client/experiences")
    public ResponseEntity<ExperienceResponse>
            createExperience(
                    @Valid
                    @RequestBody ExperienceRequest request
            ) {

        ExperienceResponse createdExperience =
                experienceService.createExperience(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdExperience);
    }

    @PutMapping("/client/experiences/{id}")
    public ResponseEntity<ExperienceResponse>
            updateExperience(
                    @PathVariable Long id,
                    @Valid
                    @RequestBody ExperienceRequest request
            ) {

        ExperienceResponse updatedExperience =
                experienceService.updateExperience(
                        id,
                        request
                );

        return ResponseEntity.ok(updatedExperience);
    }

    @DeleteMapping("/client/experiences/{id}")
    public ResponseEntity<Void> deleteExperience(
            @PathVariable Long id
    ) {
        experienceService.deleteExperience(id);

        return ResponseEntity.noContent().build();
    }
}