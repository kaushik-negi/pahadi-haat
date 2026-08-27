package com.pahadihaat.backend.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
@Profile("prod")
public class DatabaseConfig {

    @Value("${DATABASE_URL:${spring.datasource.url:}}")
    private String databaseUrl;

    @Value("${DATABASE_USERNAME:${spring.datasource.username:}}")
    private String username;

    @Value("${DATABASE_PASSWORD:${spring.datasource.password:}}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();

        String jdbcUrl = databaseUrl != null ? databaseUrl.trim() : "";
        String user = username != null ? username.trim() : "";
        String pass = password != null ? password.trim() : "";

        if (!jdbcUrl.isEmpty()) {
            if (jdbcUrl.startsWith("postgres://") || jdbcUrl.startsWith("postgresql://")) {
                try {
                    // Standardize scheme to parse host, port, user info, and database name
                    String cleanUrl = jdbcUrl.replaceFirst("^postgres(ql)?://", "http://");
                    URI uri = URI.create(cleanUrl);

                    String host = uri.getHost();
                    int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                    String path = uri.getPath(); // e.g. /pahadihaat

                    jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;

                    if (uri.getUserInfo() != null && !uri.getUserInfo().isBlank()) {
                        String[] userInfo = uri.getUserInfo().split(":", 2);
                        if (user.isEmpty()) {
                            user = userInfo[0];
                        }
                        if (pass.isEmpty() && userInfo.length > 1) {
                            pass = userInfo[1];
                        }
                    }
                } catch (Exception e) {
                    if (!jdbcUrl.startsWith("jdbc:")) {
                        jdbcUrl = "jdbc:" + jdbcUrl;
                    }
                }
            } else if (!jdbcUrl.startsWith("jdbc:")) {
                jdbcUrl = "jdbc:postgresql://" + jdbcUrl;
            }
        }

        config.setJdbcUrl(jdbcUrl);
        if (!user.isEmpty()) {
            config.setUsername(user);
        }
        if (!pass.isEmpty()) {
            config.setPassword(pass);
        }
        config.setDriverClassName("org.postgresql.Driver");

        return new HikariDataSource(config);
    }
}
