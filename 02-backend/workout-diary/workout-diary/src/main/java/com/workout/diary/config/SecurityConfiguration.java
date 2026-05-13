package com.workout.diary.config;

import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // 1. 요청 권한 설정 (Authorization)
        http.authorizeHttpRequests(configurer ->
                configurer
                        // "/secure/**"가 포함된 경로들은 반드시 인증(로그인)된 사용자만 접근 가능
                        .requestMatchers("/api/workouts/secure/**",
                                "/api/reviews/secure/**",
                                "/api/messages/secure/**",
                                "/api/admin/secure/**"
                        )
                        .authenticated()
                        // 그 외 모든 요청(일반 조회 등)은 누구나 접근 가능
                         .anyRequest().permitAll())
                // 2. Auth0로부터 발급받은 JWT 토큰을 검증하도록 설정.
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(withDefaults()))

                // 3. CORS 설정 (Frontend인 localhost:3000 등과의 통신 허용)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        // 4. CSRF 보호 비활성화
        // REST API는 세션을 사용하지 않고 토큰을 사용하므로 일반적으로 CSRF를 비활성화.
        http.csrf(AbstractHttpConfigurer::disable);

        // 5. 콘텐츠 협상 전략 설정
        // 클라이언트가 요청 헤더에 'Accept'를 보냈을 때 응답 타입을 결정하는 방식 설정
        http.setSharedObject(ContentNegotiationStrategy.class,
                new HeaderContentNegotiationStrategy());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 프론트엔드 주소 허용
        configuration.setAllowedOrigins(Arrays.asList(
                "https://localhost:3000",
                "https://dailylift.duckdns.org"
        ));

        // PUT 메서드를 포함한 모든 필요 메서드 허용
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // 헤더 허용 (토큰 전송을 위해 Authorization 필수)
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));

        // 쿠키나 인증 정보를 포함한 요청 허용
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
