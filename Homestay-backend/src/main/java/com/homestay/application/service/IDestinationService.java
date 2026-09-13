package com.homestay.application.service;

import java.util.List;

import com.homestay.application.dto.request.DestinationRequest;
import com.homestay.application.dto.response.DestinationResponse;

public interface IDestinationService {

    List<DestinationResponse> getPublicDestinations();

    DestinationResponse getPublicDestinationById(Long id);

    List<DestinationResponse> searchDestinations(String search);

    List<DestinationResponse> getAllDestinationsForClient();

    DestinationResponse getDestinationByIdForClient(Long id);

    DestinationResponse createDestination(
            DestinationRequest request
    );

    DestinationResponse updateDestination(
            Long id,
            DestinationRequest request
    );

    void deleteDestination(Long id);
}