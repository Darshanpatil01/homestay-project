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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.homestay.application.dto.request.DestinationRequest;
import com.homestay.application.dto.response.DestinationResponse;
import com.homestay.application.service.IDestinationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class DestinationController {

    private final IDestinationService destinationService;

    public DestinationController(
            IDestinationService destinationService
    ) {
        this.destinationService = destinationService;
    }

    // Public endpoints

    @GetMapping("/destinations")
    public ResponseEntity<List<DestinationResponse>>
            getPublicDestinations(
                    @RequestParam(required = false)
                    String search
            ) {

        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(
                    destinationService.searchDestinations(
                            search
                    )
            );
        }

        return ResponseEntity.ok(
                destinationService.getPublicDestinations()
        );
    }

    @GetMapping("/destinations/{id}")
    public ResponseEntity<DestinationResponse>
            getPublicDestinationById(
                    @PathVariable Long id
            ) {

        return ResponseEntity.ok(
                destinationService
                        .getPublicDestinationById(id)
        );
    }

    // Client and Admin endpoints

    @GetMapping("/client/destinations")
    public ResponseEntity<List<DestinationResponse>>
            getAllDestinationsForClient() {

        return ResponseEntity.ok(
                destinationService
                        .getAllDestinationsForClient()
        );
    }

    @GetMapping("/client/destinations/{id}")
    public ResponseEntity<DestinationResponse>
            getDestinationByIdForClient(
                    @PathVariable Long id
            ) {

        return ResponseEntity.ok(
                destinationService
                        .getDestinationByIdForClient(id)
        );
    }

    @PostMapping("/client/destinations")
    public ResponseEntity<DestinationResponse>
            createDestination(
                    @Valid
                    @RequestBody DestinationRequest request
            ) {

        DestinationResponse createdDestination =
                destinationService.createDestination(
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdDestination);
    }

    @PutMapping("/client/destinations/{id}")
    public ResponseEntity<DestinationResponse>
            updateDestination(
                    @PathVariable Long id,
                    @Valid
                    @RequestBody DestinationRequest request
            ) {

        DestinationResponse updatedDestination =
                destinationService.updateDestination(
                        id,
                        request
                );

        return ResponseEntity.ok(
                updatedDestination
        );
    }

    @DeleteMapping("/client/destinations/{id}")
    public ResponseEntity<Void> deleteDestination(
            @PathVariable Long id
    ) {
        destinationService.deleteDestination(id);

        return ResponseEntity.noContent().build();
    }
}