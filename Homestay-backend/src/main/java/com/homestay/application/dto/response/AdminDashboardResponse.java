package com.homestay.application.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class AdminDashboardResponse {

    private Long totalUsers;
    private Long activeUsers;
    private Long blockedUsers;
    private Long totalClients;
    private Long totalHomestays;
    private Long activeHomestays;
    private Long totalBookings;
    private Long pendingBookings;
    private Long confirmedBookings;
    private BigDecimal totalRevenue;
    private List<BookingResponse> recentBookings;

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(Long activeUsers) {
        this.activeUsers = activeUsers;
    }

    public Long getBlockedUsers() {
        return blockedUsers;
    }

    public void setBlockedUsers(Long blockedUsers) {
        this.blockedUsers = blockedUsers;
    }

    public Long getTotalClients() {
        return totalClients;
    }

    public void setTotalClients(Long totalClients) {
        this.totalClients = totalClients;
    }

    public Long getTotalHomestays() {
        return totalHomestays;
    }

    public void setTotalHomestays(Long totalHomestays) {
        this.totalHomestays = totalHomestays;
    }

    public Long getActiveHomestays() {
        return activeHomestays;
    }

    public void setActiveHomestays(Long activeHomestays) {
        this.activeHomestays = activeHomestays;
    }

    public Long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(Long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public Long getPendingBookings() {
        return pendingBookings;
    }

    public void setPendingBookings(Long pendingBookings) {
        this.pendingBookings = pendingBookings;
    }

    public Long getConfirmedBookings() {
        return confirmedBookings;
    }

    public void setConfirmedBookings(Long confirmedBookings) {
        this.confirmedBookings = confirmedBookings;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public List<BookingResponse> getRecentBookings() {
        return recentBookings;
    }

    public void setRecentBookings(
            List<BookingResponse> recentBookings
    ) {
        this.recentBookings = recentBookings;
    }
}