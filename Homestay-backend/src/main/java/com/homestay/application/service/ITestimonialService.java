package com.homestay.application.service;

import java.util.List;

import com.homestay.application.dto.request.TestimonialRequest;
import com.homestay.application.dto.response.TestimonialResponse;

public interface ITestimonialService {

    List<TestimonialResponse> getPublicTestimonials();

    TestimonialResponse getPublicTestimonialById(Long id);

    List<TestimonialResponse> getAllTestimonialsForClient();

    TestimonialResponse getTestimonialByIdForClient(Long id);

    TestimonialResponse createTestimonial(
            TestimonialRequest request
    );

    TestimonialResponse updateTestimonial(
            Long id,
            TestimonialRequest request
    );

    void deleteTestimonial(Long id);
}