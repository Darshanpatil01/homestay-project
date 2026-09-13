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

import com.homestay.application.dto.request.BenefitRequest;
import com.homestay.application.dto.response.BenefitResponse;
import com.homestay.application.service.IBenefitService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class BenefitController {

    private final IBenefitService benefitService;

    public BenefitController(
            IBenefitService benefitService
    ) {
        this.benefitService = benefitService;
    }

    @GetMapping("/benefits")
    public ResponseEntity<List<BenefitResponse>>
            getPublicBenefits() {

        return ResponseEntity.ok(
                benefitService.getPublicBenefits()
        );
    }

    @GetMapping("/benefits/{id}")
    public ResponseEntity<BenefitResponse>
            getPublicBenefitById(
                    @PathVariable Long id
            ) {

        return ResponseEntity.ok(
                benefitService.getPublicBenefitById(id)
        );
    }

    @GetMapping("/client/benefits")
    public ResponseEntity<List<BenefitResponse>>
            getAllBenefitsForClient() {

        return ResponseEntity.ok(
                benefitService.getAllBenefitsForClient()
        );
    }

    @GetMapping("/client/benefits/{id}")
    public ResponseEntity<BenefitResponse>
            getBenefitByIdForClient(
                    @PathVariable Long id
            ) {

        return ResponseEntity.ok(
                benefitService.getBenefitByIdForClient(id)
        );
    }

    @PostMapping("/client/benefits")
    public ResponseEntity<BenefitResponse>
            createBenefit(
                    @Valid
                    @RequestBody BenefitRequest request
            ) {

        BenefitResponse createdBenefit =
                benefitService.createBenefit(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdBenefit);
    }

    @PutMapping("/client/benefits/{id}")
    public ResponseEntity<BenefitResponse>
            updateBenefit(
                    @PathVariable Long id,
                    @Valid
                    @RequestBody BenefitRequest request
            ) {

        BenefitResponse updatedBenefit =
                benefitService.updateBenefit(
                        id,
                        request
                );

        return ResponseEntity.ok(updatedBenefit);
    }

    @DeleteMapping("/client/benefits/{id}")
    public ResponseEntity<Void> deleteBenefit(
            @PathVariable Long id
    ) {
        benefitService.deleteBenefit(id);

        return ResponseEntity.noContent().build();
    }
}