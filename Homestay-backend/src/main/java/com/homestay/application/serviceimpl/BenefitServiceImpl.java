package com.homestay.application.serviceimpl;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.homestay.application.dto.request.BenefitRequest;
import com.homestay.application.dto.response.BenefitResponse;
import com.homestay.application.mapper.BenefitMapper;
import com.homestay.application.service.IBenefitService;
import com.homestay.domain.entity.Benefit;
import com.homestay.infrastructure.repository.BenefitRepository;

@Service
@Transactional
public class BenefitServiceImpl
        implements IBenefitService {

    private final BenefitRepository benefitRepository;

    public BenefitServiceImpl(
            BenefitRepository benefitRepository
    ) {
        this.benefitRepository = benefitRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BenefitResponse> getPublicBenefits() {
        return benefitRepository
                .findByActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(BenefitMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BenefitResponse getPublicBenefitById(Long id) {
        Benefit benefit = getBenefitEntity(id);

        if (!Boolean.TRUE.equals(benefit.getActive())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Benefit not found."
            );
        }

        return BenefitMapper.toResponse(benefit);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BenefitResponse> getAllBenefitsForClient() {
        return benefitRepository
                .findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(BenefitMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BenefitResponse getBenefitByIdForClient(Long id) {
        Benefit benefit = getBenefitEntity(id);

        return BenefitMapper.toResponse(benefit);
    }

    @Override
    public BenefitResponse createBenefit(
            BenefitRequest request
    ) {
        String title = request.getTitle().trim();

        if (benefitRepository.existsByTitleIgnoreCase(title)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A benefit with this title already exists."
            );
        }

        Benefit benefit = BenefitMapper.toEntity(request);

        Benefit savedBenefit =
                benefitRepository.save(benefit);

        return BenefitMapper.toResponse(savedBenefit);
    }

    @Override
    public BenefitResponse updateBenefit(
            Long id,
            BenefitRequest request
    ) {
        Benefit benefit = getBenefitEntity(id);

        String title = request.getTitle().trim();

        if (benefitRepository
                .existsByTitleIgnoreCaseAndIdNot(
                        title,
                        id
                )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A benefit with this title already exists."
            );
        }

        BenefitMapper.updateEntity(benefit, request);

        Benefit updatedBenefit =
                benefitRepository.save(benefit);

        return BenefitMapper.toResponse(updatedBenefit);
    }

    @Override
    public void deleteBenefit(Long id) {
        Benefit benefit = getBenefitEntity(id);

        benefitRepository.delete(benefit);
    }

    private Benefit getBenefitEntity(Long id) {
        return benefitRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Benefit not found with ID: " + id
                        )
                );
    }
}