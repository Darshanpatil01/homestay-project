package com.homestay.application.serviceimpl;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.homestay.application.dto.request.HomestayRequest;
import com.homestay.application.dto.response.HomestayResponse;
import com.homestay.application.mapper.HomestayMapper;
import com.homestay.application.service.IHomestayService;
import com.homestay.domain.entity.Homestay;
import com.homestay.domain.enums.HomestayStatus;
import com.homestay.infrastructure.repository.HomestayRepository;

@Service
@Transactional
public class HomestayServiceImpl implements IHomestayService {

    private final HomestayRepository homestayRepository;

    public HomestayServiceImpl(
            HomestayRepository homestayRepository
    ) {
        this.homestayRepository = homestayRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<HomestayResponse> getPublicHomestays() {
        return homestayRepository
                .findByStatus(HomestayStatus.ACTIVE)
                .stream()
                .map(HomestayMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<HomestayResponse> getAllHomestaysForClient() {
        return homestayRepository
                .findAll()
                .stream()
                .map(HomestayMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<HomestayResponse> getFeaturedHomestays() {
        return homestayRepository
                .findByFeaturedTrueAndStatus(
                        HomestayStatus.ACTIVE
                )
                .stream()
                .map(HomestayMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public HomestayResponse getPublicHomestayById(Long id) {
        Homestay homestay = getHomestayEntity(id);

        if (homestay.getStatus() != HomestayStatus.ACTIVE) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Homestay not found."
            );
        }

        return HomestayMapper.toResponse(homestay);
    }

    @Override
    @Transactional(readOnly = true)
    public HomestayResponse getHomestayByIdForClient(Long id) {
        return HomestayMapper.toResponse(
                getHomestayEntity(id)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<HomestayResponse> searchHomestays(
            String search
    ) {
        if (search == null || search.isBlank()) {
            return getPublicHomestays();
        }

        return homestayRepository
                .findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(
                        search.trim(),
                        search.trim()
                )
                .stream()
                .filter(homestay ->
                        homestay.getStatus()
                                == HomestayStatus.ACTIVE
                )
                .map(HomestayMapper::toResponse)
                .toList();
    }

    @Override
    public HomestayResponse createHomestay(
            HomestayRequest request
    ) {
        Homestay homestay =
                HomestayMapper.toEntity(request);

        Homestay savedHomestay =
                homestayRepository.save(homestay);

        return HomestayMapper.toResponse(savedHomestay);
    }

    @Override
    public HomestayResponse updateHomestay(
            Long id,
            HomestayRequest request
    ) {
        Homestay homestay = getHomestayEntity(id);

        HomestayMapper.updateEntity(
                homestay,
                request
        );

        Homestay updatedHomestay =
                homestayRepository.save(homestay);

        return HomestayMapper.toResponse(updatedHomestay);
    }

    @Override
    public void deleteHomestay(Long id) {
        Homestay homestay = getHomestayEntity(id);

        homestayRepository.delete(homestay);
    }

    private Homestay getHomestayEntity(Long id) {
        return homestayRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Homestay not found with ID: " + id
                        )
                );
    }
}