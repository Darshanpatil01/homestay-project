package com.homestay.application.dto.response;

public class WishlistStatusResponse {

    private Long homestayId;
    private Boolean saved;

    public WishlistStatusResponse() {
    }

    public WishlistStatusResponse(
            Long homestayId,
            Boolean saved
    ) {
        this.homestayId = homestayId;
        this.saved = saved;
    }

    public Long getHomestayId() {
        return homestayId;
    }

    public void setHomestayId(Long homestayId) {
        this.homestayId = homestayId;
    }

    public Boolean getSaved() {
        return saved;
    }

    public void setSaved(Boolean saved) {
        this.saved = saved;
    }
}