package com.homestay.infrastructure.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.homestay.domain.entity.NavigationLink;
import com.homestay.domain.entity.User;
import com.homestay.domain.entity.WebsiteSettings;
import com.homestay.domain.enums.Role;
import com.homestay.domain.enums.UserStatus;
import com.homestay.infrastructure.repository.NavigationLinkRepository;
import com.homestay.infrastructure.repository.UserRepository;
import com.homestay.infrastructure.repository.WebsiteSettingsRepository;

@Configuration
public class InitialDataConfig {

    @Bean
    public CommandLineRunner createInitialData(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            WebsiteSettingsRepository settingsRepository,
            NavigationLinkRepository navigationRepository
    ) {
        return args -> {
            createAdminAccount(
                    userRepository,
                    passwordEncoder
            );

            createClientAccount(
                    userRepository,
                    passwordEncoder
            );

            createWebsiteSettings(
                    settingsRepository
            );

            createNavigationLinks(
                    navigationRepository
            );
        };
    }

    private void createAdminAccount(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        String email = "admin@staynest.in";

        if (userRepository.existsByEmailIgnoreCase(email)) {
            return;
        }

        User admin = new User();

        admin.setFullName("StayNest Administrator");
        admin.setEmail(email);
        admin.setPhone("9999999999");

        admin.setPassword(
                passwordEncoder.encode("Admin@123")
        );

        admin.setRole(Role.ADMIN);
        admin.setStatus(UserStatus.ACTIVE);

        userRepository.save(admin);

        System.out.println(
                "Initial administrator account created."
        );
    }

    private void createClientAccount(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        String email = "client@staynest.in";

        if (userRepository.existsByEmailIgnoreCase(email)) {
            return;
        }

        User client = new User();

        client.setFullName("StayNest Website Owner");
        client.setEmail(email);
        client.setPhone("8888888888");

        client.setPassword(
                passwordEncoder.encode("Client@123")
        );

        client.setRole(Role.CLIENT);
        client.setStatus(UserStatus.APPROVED);

        userRepository.save(client);

        System.out.println(
                "Initial client account created."
        );
    }

    private void createWebsiteSettings(
            WebsiteSettingsRepository settingsRepository
    ) {
        if (settingsRepository.count() > 0) {
            return;
        }

        WebsiteSettings settings =
                new WebsiteSettings();

        settings.setWebsiteName("StayNest");

        settings.setSignInLabel("Sign In");

        settings.setClientButtonLabel(
                "List Your Property"
        );

        settings.setHeroSmallTitle(
                "HANDPICKED HOMESTAYS ACROSS INDIA"
        );

        settings.setHeroTitle(
                "Stay somewhere"
        );

        settings.setHeroHighlightedText(
                "worth remembering."
        );

        settings.setHeroDescription(
                "Thoughtful homes, generous hosts and unforgettable experiences."
        );

        settings.setHeroImage(
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
        );

        settings.setFooterDescription(
                "Discover handpicked homestays, local experiences and welcoming hosts across India."
        );

        settings.setContactEmail(
                "support@staynest.in"
        );

        settings.setContactPhone(
                "+91 98765 43210"
        );

        settings.setContactAddress(
                "Mumbai, Maharashtra, India"
        );

        settingsRepository.save(settings);

        System.out.println(
                "Initial website settings created."
        );
    }

    private void createNavigationLinks(
            NavigationLinkRepository navigationRepository
    ) {
        if (navigationRepository.count() > 0) {
            return;
        }

        saveNavigationLink(
                navigationRepository,
                "Home",
                "/",
                1
        );

        saveNavigationLink(
                navigationRepository,
                "Homestays",
                "/homestays",
                2
        );

        saveNavigationLink(
                navigationRepository,
                "Destinations",
                "/destinations",
                3
        );

        saveNavigationLink(
                navigationRepository,
                "Experiences",
                "/experiences",
                4
        );

        saveNavigationLink(
                navigationRepository,
                "About",
                "/about",
                5
        );

        saveNavigationLink(
                navigationRepository,
                "Contact",
                "/contact",
                6
        );

        System.out.println(
                "Initial navigation links created."
        );
    }

    private void saveNavigationLink(
            NavigationLinkRepository navigationRepository,
            String label,
            String path,
            int displayOrder
    ) {
        NavigationLink link = new NavigationLink();

        link.setLabel(label);
        link.setPath(path);
        link.setDisplayOrder(displayOrder);
        link.setActive(true);

        navigationRepository.save(link);
    }
}