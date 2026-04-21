package lk.ijse.back_end.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AppConfig {

    /**
     * Entity සහ DTO අතර දත්ත හුවමාරු කිරීමට ModelMapper Bean එක අවශ්‍ය වේ.
     * මෙය නොමැති වුවහොත් AuthServiceImpl හි NullPointerException එකක් ඇති විය හැක.
     */
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    /**
     * Passwords Encode කිරීමට සහ Match කිරීමට BCryptPasswordEncoder භාවිතා කරයි.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}