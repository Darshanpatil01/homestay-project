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

import com.homestay.application.dto.request.TestimonialRequest;
import com.homestay.application.dto.response.TestimonialResponse;
import com.homestay.application.service.ITestimonialService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class TestimonialController {

    private final ITestimonialService testimonialService;

    public TestimonialController(
            ITestimonialService testimonialService
    ) {
        this.testimonialService = testimonialService;
    }

    @GetMapping("/testimonials")
    public ResponseEntity<List<TestimonialResponse>>
            getPublicTestimonials() {

        return ResponseEntity.ok(
                testimonialService.getPublicTestimonials()
        );
    }

    @GetMapping("/testimonials/{id}")
    public ResponseEntity<TestimonialResponse>
            getPublicTestimonialById(
                    @PathVariable Long id
            ) {

        return ResponseEntity.ok(
                testimonialService
                        .getPublicTestimonialById(id)
        );
    }

    @GetMapping("/client/testimonials")
    public ResponseEntity<List<TestimonialResponse>>
            getAllTestimonialsForClient() {

        return ResponseEntity.ok(
                testimonialService
                        .getAllTestimonialsForClient()
        );
    }

    @GetMapping("/client/testimonials/{id}")
    public ResponseEntity<TestimonialResponse>
            getTestimonialByIdForClient(
                    @PathVariable Long id
            ) {

        return ResponseEntity.ok(
                testimonialService
                        .getTestimonialByIdForClient(id)
        );
    }

    @PostMapping("/client/testimonials")
    public ResponseEntity<TestimonialResponse>
            createTestimonial(
                    @Valid
                    @RequestBody TestimonialRequest request
            ) {

        TestimonialResponse createdTestimonial =
                testimonialService
                        .createTestimonial(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdTestimonial);
    }

    @PutMapping("/client/testimonials/{id}")
    public ResponseEntity<TestimonialResponse>
            updateTestimonial(
                    @PathVariable Long id,
                    @Valid
                    @RequestBody TestimonialRequest request
            ) {

        TestimonialResponse updatedTestimonial =
                testimonialService.updateTestimonial(
                        id,
                        request
                );

        return ResponseEntity.ok(updatedTestimonial);
    }

    @DeleteMapping("/client/testimonials/{id}")
    public ResponseEntity<Void> deleteTestimonial(
            @PathVariable Long id
    ) {
        testimonialService.deleteTestimonial(id);

        return ResponseEntity.noContent().build();
    }
}