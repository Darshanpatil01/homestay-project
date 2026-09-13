package com.homestay.application.service;

import java.util.List;

import com.homestay.application.dto.request.BenefitRequest;
import com.homestay.application.dto.response.BenefitResponse;

public interface IBenefitService {

    List<BenefitResponse> getPublicBenefits();

    BenefitResponse getPublicBenefitById(Long id);

    List<BenefitResponse> getAllBenefitsForClient();

    BenefitResponse getBenefitByIdForClient(Long id);

    BenefitResponse createBenefit(
            BenefitRequest request
    );

    BenefitResponse updateBenefit(
            Long id,
            BenefitRequest request
    );

    void deleteBenefit(Long id);
}