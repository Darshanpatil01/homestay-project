package com.homestay.infrastructure.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.homestay.domain.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

        private final SecretKey signingKey;
        private final long jwtExpiration;

        public JwtService(
                        @Value("${application.security.jwt.secret}") String secretKey,

                        @Value("${application.security.jwt.expiration}") long jwtExpiration) {
                if (secretKey == null ||
                                secretKey.isBlank()) {
                        throw new IllegalStateException(
                                        "JWT secret is not configured.");
                }

                byte[] keyBytes = secretKey
                                .trim()
                                .getBytes(StandardCharsets.UTF_8);

                if (keyBytes.length < 32) {
                        throw new IllegalStateException(
                                        "JWT secret must contain at least 32 characters.");
                }

                this.signingKey = Keys.hmacShaKeyFor(keyBytes);

                this.jwtExpiration = jwtExpiration;
        }

        public String generateToken(User user) {

                Map<String, Object> claims = new HashMap<>();

                claims.put(
                                "userId",
                                user.getId());

                claims.put(
                                "role",
                                user.getRole().name());

                claims.put(
                                "status",
                                user.getStatus().name());

                claims.put(
                                "fullName",
                                user.getFullName());

                return buildToken(
                                claims,
                                user.getEmail());
        }

        private String buildToken(
                        Map<String, Object> claims,
                        String subject) {
                Date issuedAt = new Date();

                Date expirationDate = new Date(
                                issuedAt.getTime() +
                                                jwtExpiration);

                return Jwts.builder()
                                .claims(claims)
                                .subject(subject)
                                .issuedAt(issuedAt)
                                .expiration(expirationDate)
                                .signWith(signingKey)
                                .compact();
        }

        public String extractEmail(
                        String token) {
                return extractClaim(
                                token,
                                Claims::getSubject);
        }

        public Long extractUserId(
                        String token) {
                Number userId = extractClaim(
                                token,
                                claims -> claims.get(
                                                "userId",
                                                Number.class));

                return userId != null
                                ? userId.longValue()
                                : null;
        }

        public String extractRole(
                        String token) {
                return extractClaim(
                                token,
                                claims -> claims.get(
                                                "role",
                                                String.class));
        }

        public Date extractExpiration(
                        String token) {
                return extractClaim(
                                token,
                                Claims::getExpiration);
        }

        public <T> T extractClaim(
                        String token,
                        Function<Claims, T> claimResolver) {
                Claims claims = extractAllClaims(token);

                return claimResolver.apply(claims);
        }

        public boolean isTokenValid(
                        String token,
                        UserDetails userDetails) {
                String email = extractEmail(token);

                return email != null &&
                                email.equalsIgnoreCase(
                                                userDetails.getUsername())
                                &&
                                !isTokenExpired(token);
        }

        private boolean isTokenExpired(
                        String token) {
                return extractExpiration(token)
                                .before(new Date());
        }

        private Claims extractAllClaims(
                        String token) {
                return Jwts.parser()
                                .verifyWith(signingKey)
                                .build()
                                .parseSignedClaims(token)
                                .getPayload();
        }
}