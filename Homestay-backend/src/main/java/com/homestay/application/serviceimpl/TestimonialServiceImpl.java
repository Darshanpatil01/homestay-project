package com.homestay.application.serviceimpl;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.homestay.application.dto.request.TestimonialRequest;
import com.homestay.application.dto.response.TestimonialResponse;
import com.homestay.application.mapper.TestimonialMapper;
import com.homestay.application.service.ITestimonialService;
import com.homestay.domain.entity.Testimonial;
import com.homestay.infrastructure.repository.TestimonialRepository;

@Service
@Transactional
public class TestimonialServiceImpl
        implements ITestimonialService {

    private final TestimonialRepository testimonialRepository;

    public TestimonialServiceImpl(
            TestimonialRepository testimonialRepository
    ) {
        this.testimonialRepository = testimonialRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TestimonialResponse> getPublicTestimonials() {
        return testimonialRepository
                .findByActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(TestimonialMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TestimonialResponse getPublicTestimonialById(
            Long id
    ) {
        Testimonial testimonial = getTestimonialEntity(id);

        if (!Boolean.TRUE.equals(testimonial.getActive())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Testimonial not found."
            );
        }

        return TestimonialMapper.toResponse(testimonial);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TestimonialResponse>
            getAllTestimonialsForClient() {

        return testimonialRepository
                .findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(TestimonialMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TestimonialResponse
            getTestimonialByIdForClient(Long id) {

        Testimonial testimonial = getTestimonialEntity(id);

        return TestimonialMapper.toResponse(testimonial);
    }

    @Override
    public TestimonialResponse createTestimonial(
            TestimonialRequest request
    ) {
        Testimonial testimonial =
                TestimonialMapper.toEntity(request);

        Testimonial savedTestimonial =
                testimonialRepository.save(testimonial);

        return TestimonialMapper.toResponse(
                savedTestimonial
        );
    }

    @Override
    public TestimonialResponse updateTestimonial(
            Long id,
            TestimonialRequest request
    ) {
        Testimonial testimonial = getTestimonialEntity(id);

        TestimonialMapper.updateEntity(
                testimonial,
                request
        );

        Testimonial updatedTestimonial =
                testimonialRepository.save(testimonial);

        return TestimonialMapper.toResponse(
                updatedTestimonial
        );
    }

    @Override
    public void deleteTestimonial(Long id) {
        Testimonial testimonial = getTestimonialEntity(id);

        testimonialRepository.delete(testimonial);
    }

    private Testimonial getTestimonialEntity(Long id) {
        return testimonialRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Testimonial not found with ID: " + id
                        )
                );
    }
}