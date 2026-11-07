package com.aiinterview.prep.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    private static final Logger logger = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${DATABASE_URL:#{null}}")
    private String databaseUrl;

    @Value("${spring.datasource.url:#{null}}")
    private String springDatasourceUrl;

    @Value("${spring.datasource.username:#{null}}")
    private String username;

    @Value("${spring.datasource.password:#{null}}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();

        // 1. Check for Render PostgreSQL DATABASE_URL (e.g., postgres://user:password@host:port/database)
        String envDbUrl = System.getenv("DATABASE_URL");
        if (envDbUrl == null || envDbUrl.isBlank()) {
            envDbUrl = databaseUrl;
        }

        if (envDbUrl != null && !envDbUrl.isBlank() && 
            (envDbUrl.startsWith("postgres://") || envDbUrl.startsWith("postgresql://"))) {
            try {
                logger.info("Detected Render PostgreSQL DATABASE_URL. Translating to JDBC configuration...");
                URI dbUri = new URI(envDbUrl);

                String host = dbUri.getHost();
                int port = dbUri.getPort() == -1 ? 5432 : dbUri.getPort();
                String path = dbUri.getPath();
                String dbName = (path != null && path.length() > 1) ? path.substring(1) : "";

                String userInfo = dbUri.getUserInfo();
                String dbUser = "";
                String dbPass = "";
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    dbUser = parts[0];
                    dbPass = parts[1];
                } else if (userInfo != null) {
                    dbUser = userInfo;
                }

                String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s?sslmode=prefer", host, port, dbName);
                logger.info("Configured JDBC URL: jdbc:postgresql://{}:{}/{}", host, port, dbName);

                config.setJdbcUrl(jdbcUrl);
                config.setUsername(dbUser);
                config.setPassword(dbPass);
                config.setDriverClassName("org.postgresql.Driver");
                config.setMaximumPoolSize(10);
                config.setConnectionTimeout(30000);
                config.setIdleTimeout(600000);
                config.setMaxLifetime(1800000);
                return new HikariDataSource(config);
            } catch (Exception e) {
                logger.error("Failed to parse DATABASE_URL: " + e.getMessage(), e);
            }
        }

        // 2. Check for explicit SPRING_DATASOURCE_URL or fallback to environment / properties
        String url = System.getenv("SPRING_DATASOURCE_URL");
        if (url == null || url.isBlank()) {
            url = springDatasourceUrl;
        }

        if (url == null || url.isBlank()) {
            String dbHost = System.getenv("DB_HOST") != null ? System.getenv("DB_HOST") : "localhost";
            String dbPort = System.getenv("DB_PORT") != null ? System.getenv("DB_PORT") : "3307";
            String dbName = System.getenv("DB_NAME") != null ? System.getenv("DB_NAME") : "ai_interview_prep";
            url = String.format("jdbc:mysql://%s:%s/%s?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true",
                    dbHost, dbPort, dbName);
        }

        config.setJdbcUrl(url);

        String user = username;
        if (user == null || user.isBlank()) {
            user = System.getenv("DB_USERNAME") != null ? System.getenv("DB_USERNAME") : "root";
        }
        config.setUsername(user);

        String pass = password;
        if (pass == null) {
            pass = System.getenv("DB_PASSWORD") != null ? System.getenv("DB_PASSWORD") : "root";
        }
        config.setPassword(pass);

        if (url.startsWith("jdbc:postgresql:")) {
            config.setDriverClassName("org.postgresql.Driver");
        } else if (url.startsWith("jdbc:mysql:")) {
            config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        } else if (url.startsWith("jdbc:h2:")) {
            config.setDriverClassName("org.h2.Driver");
        }

        config.setMaximumPoolSize(10);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);
        return new HikariDataSource(config);
    }
}
