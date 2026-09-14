package com.homestay.infrastructure.security;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        public SecurityConfig(
                        JwtAuthenticationFilter jwtAuthenticationFilter) {
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http) throws Exception {

                http
                                .csrf(csrf -> csrf.disable())

                                .cors(cors -> cors.configurationSource(
                                                corsConfigurationSource(
                                                                null)))

                                .sessionManagement(session -> session.sessionCreationPolicy(
                                                SessionCreationPolicy.STATELESS))

                                .authorizeHttpRequests(authorize -> authorize

                                                .requestMatchers(
                                                                HttpMethod.OPTIONS,
                                                                "/**")
                                                .permitAll()

                                                .requestMatchers("/api/auth/**")
                                                .permitAll()

                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/website/**")
                                                .permitAll()

                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/homestays/**",
                                                                "/api/properties/**",
                                                                "/api/destinations/**",
                                                                "/api/categories/**",
                                                                "/api/experiences/**",
                                                                "/api/benefits/**",
                                                                "/api/testimonials/**")
                                                .permitAll()

                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/uploads/**")
                                                .permitAll()

                                                .requestMatchers(
                                                                "/swagger-ui/**",
                                                                "/swagger-ui.html",
                                                                "/v3/api-docs/**")
                                                .permitAll()

                                                .requestMatchers("/error")
                                                .permitAll()

                                                .requestMatchers("/api/admin/**")
                                                .hasRole("ADMIN")

                                                .requestMatchers("/api/client/**")
                                                .hasAnyRole("CLIENT", "ADMIN")

                                                .requestMatchers(
                                                                "/api/users/**",
                                                                "/api/bookings/**",
                                                                "/api/wishlist/**")
                                                .authenticated()

                                                .anyRequest()
                                                .authenticated())

                                .addFilterBefore(
                                                jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public AuthenticationManager authenticationManager(
                        AuthenticationConfiguration configuration) throws Exception {

                return configuration.getAuthenticationManager();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource(
                        @Value("${application.frontend.url:http://localhost:5173}") String frontendUrl) {

                CorsConfiguration configuration = new CorsConfiguration();

                List<String> allowedOrigins = new ArrayList<>();

                allowedOrigins.add(
                                "http://localhost:5173");

                if (frontendUrl != null &&
                                !frontendUrl.isBlank() &&
                                !frontendUrl.equals(
                                                "http://localhost:5173")) {
                        allowedOrigins.add(
                                        removeTrailingSlash(
                                                        frontendUrl));
                }

                configuration.setAllowedOrigins(
                                allowedOrigins);

                configuration.setAllowedMethods(
                                List.of(
                                                "GET",
                                                "POST",
                                                "PUT",
                                                "PATCH",
                                                "DELETE",
                                                "OPTIONS"));

                configuration.setAllowedHeaders(
                                List.of("*"));

                configuration.setExposedHeaders(
                                List.of("Authorization"));

                configuration.setAllowCredentials(true);

                configuration.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration(
                                "/**",
                                configuration);

                return source;
        }

        private String removeTrailingSlash(
                        String url) {

                String normalizedUrl = url.trim();

                while (normalizedUrl.endsWith("/")) {
                        normalizedUrl = normalizedUrl.substring(
                                        0,
                                        normalizedUrl.length() - 1);
                }

                return normalizedUrl;
        }
}