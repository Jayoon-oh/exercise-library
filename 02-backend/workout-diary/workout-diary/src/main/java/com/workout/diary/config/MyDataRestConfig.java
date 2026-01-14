package com.workout.diary.config;

import com.workout.diary.entity.Workout;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private String theAllowedOrigins = "http://localhost:3000";

    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config,
                                                     CorsRegistry cors) {
        HttpMethod[] theUnsupportedActions = {
                HttpMethod.POST,
                HttpMethod.PATCH,
                HttpMethod.DELETE,
                HttpMethod.PUT
        };

                config.exposeIdsFor(Workout.class);

                disableHttpMethods(Workout.class, config, theUnsupportedActions);

                // CORS 설정: 다른 도메인(localhost:3000) 에서 API 접속 허용.
                cors.addMapping(config.getBasePath() + "/**")
                        .allowedOrigins(theAllowedOrigins);
        }

        private void disableHttpMethods(Class theClass,
                                        RepositoryRestConfiguration config,
                                        HttpMethod[] theUnsupportedActions) {
            config.getExposureConfiguration()
                    .forDomainType(theClass)
                    .withItemExposure((metdata, httpMethods) ->
                            httpMethods.disable(theUnsupportedActions)) // 단건 조회 기능 제한
                            .withCollectionExposure((metdata, httpMethods) ->
                                    httpMethods.disable(theUnsupportedActions)); // 리스트 조회 기능 제한
        }
    }

