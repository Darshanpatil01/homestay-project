package com.homestay.presentation.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.homestay.application.dto.request.HomestayRequest;
import com.homestay.application.dto.response.HomestayResponse;
import com.homestay.application.service.IHomestayService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class HomestayController {

    private final IHomestayService homestayService;

    public HomestayController(
            IHomestayService homestayService
    ) {
        this.homestayService = homestayService;
    }

    // Public endpoints

    @GetMapping("/homestays")
    public ResponseEntity<List<HomestayResponse>>
            getPublicHomestays(
                    @RequestParam(
                            required = false
                    ) String search
            ) {

        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(
                    homestayService.searchHomestays(search)
            );
        }

        return ResponseEntity.ok(
                homestayService.getPublicHomestays()
        );
    }

    @GetMapping("/homestays/featured")
    public ResponseEntity<List<HomestayResponse>>
            getFeaturedHomestays() {

        return ResponseEntity.ok(
                homestayService.getFeaturedHomestays()
        );
    }

    @GetMapping("/homestays/{id}")
    public ResponseEntity<HomestayResponse>
            getPublicHomestayById(
                    @PathVariable Long id
            ) {

        return ResponseEntity.ok(
                homestayService.getPublicHomestayById(id)
        );
    }

    // Client/Admin endpoints

    @GetMapping("/client/homestays")
    public ResponseEntity<List<HomestayResponse>>
            getAllHomestaysForClient() {

        return ResponseEntity.ok(
                homestayService.getAllHomestaysForClient()
        );
    }

    @GetMapping("/client/homestays/{id}")
    public ResponseEntity<HomestayResponse>
            getHomestayByIdForClient(
                    @PathVariable Long id
            ) {

        return ResponseEntity.ok(
                homestayService.getHomestayByIdForClient(id)
        );
    }

    @PostMapping("/client/homestays")
    public ResponseEntity<HomestayResponse>
            createHomestay(
                    @Valid
                    @RequestBody HomestayRequest request
            ) {

        HomestayResponse response =
                homestayService.createHomestay(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping("/client/homestays/{id}")
    public ResponseEntity<HomestayResponse>
            updateHomestay(
                    @PathVariable Long id,
                    @Valid
                    @RequestBody HomestayRequest request
            ) {

        return ResponseEntity.ok(
                homestayService.updateHomestay(
                        id,
                        request
                )
        );
    }

    @DeleteMapping("/client/homestays/{id}")
    public ResponseEntity<Void> deleteHomestay(
            @PathVariable Long id
    ) {
        homestayService.deleteHomestay(id);

        return ResponseEntity.noContent().build();
    }
}