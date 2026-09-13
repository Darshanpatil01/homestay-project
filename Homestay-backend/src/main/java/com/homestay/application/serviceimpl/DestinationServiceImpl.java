package com.homestay.application.serviceimpl;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.homestay.application.dto.request.DestinationRequest;
import com.homestay.application.dto.response.DestinationResponse;
import com.homestay.application.mapper.DestinationMapper;
import com.homestay.application.service.IDestinationService;
import com.homestay.domain.entity.Destination;
import com.homestay.infrastructure.repository.DestinationRepository;

@Service
@Transactional
public class DestinationServiceImpl
        implements IDestinationService {

    private final DestinationRepository destinationRepository;

    public DestinationServiceImpl(
            DestinationRepository destinationRepository
    ) {
        this.destinationRepository = destinationRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DestinationResponse> getPublicDestinations() {
        return destinationRepository
                .findByActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(DestinationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DestinationResponse getPublicDestinationById(
            Long id
    ) {
        Destination destination = getDestinationEntity(id);

        if (!Boolean.TRUE.equals(destination.getActive())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Destination not found."
            );
        }

        return DestinationMapper.toResponse(destination);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DestinationResponse> searchDestinations(
            String search
    ) {
        if (search == null || search.isBlank()) {
            return getPublicDestinations();
        }

        String searchValue = search.trim();

        return destinationRepository
                .findByNameContainingIgnoreCaseOrStateContainingIgnoreCase(
                        searchValue,
                        searchValue
                )
                .stream()
                .filter(destination ->
                        Boolean.TRUE.equals(
                                destination.getActive()
                        )
                )
                .map(DestinationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DestinationResponse>
            getAllDestinationsForClient() {

        return destinationRepository
                .findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(DestinationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DestinationResponse getDestinationByIdForClient(
            Long id
    ) {
        Destination destination = getDestinationEntity(id);

        return DestinationMapper.toResponse(destination);
    }

    @Override
    public DestinationResponse createDestination(
            DestinationRequest request
    ) {
        String destinationName = request.getName().trim();

        if (destinationRepository.existsByNameIgnoreCase(
                destinationName
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A destination with this name already exists."
            );
        }

        Destination destination =
                DestinationMapper.toEntity(request);

        Destination savedDestination =
                destinationRepository.save(destination);

        return DestinationMapper.toResponse(savedDestination);
    }

    @Override
    public DestinationResponse updateDestination(
            Long id,
            DestinationRequest request
    ) {
        Destination destination = getDestinationEntity(id);

        String destinationName = request.getName().trim();

        if (destinationRepository
                .existsByNameIgnoreCaseAndIdNot(
                        destinationName,
                        id
                )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A destination with this name already exists."
            );
        }

        DestinationMapper.updateEntity(
                destination,
                request
        );

        Destination updatedDestination =
                destinationRepository.save(destination);

        return DestinationMapper.toResponse(
                updatedDestination
        );
    }

    @Override
    public void deleteDestination(Long id) {
        Destination destination = getDestinationEntity(id);

        destinationRepository.delete(destination);
    }

    private Destination getDestinationEntity(Long id) {
        return destinationRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Destination not found with ID: " + id
                        )
                );
    }
}