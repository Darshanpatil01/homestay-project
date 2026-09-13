package com.homestay.application.service;

import java.util.List;

import com.homestay.application.dto.request.HomestayRequest;
import com.homestay.application.dto.response.HomestayResponse;

public interface IHomestayService {

    List<HomestayResponse> getPublicHomestays();

    List<HomestayResponse> getAllHomestaysForClient();

    List<HomestayResponse> getFeaturedHomestays();

    HomestayResponse getPublicHomestayById(Long id);

    HomestayResponse getHomestayByIdForClient(Long id);

    List<HomestayResponse> searchHomestays(String search);

    HomestayResponse createHomestay(HomestayRequest request);

    HomestayResponse updateHomestay(
            Long id,
            HomestayRequest request
    );

    void deleteHomestay(Long id);
}