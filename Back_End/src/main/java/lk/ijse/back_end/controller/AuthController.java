package lk.ijse.back_end.controller;

import lk.ijse.back_end.dto.AuthResponseDTO;
import lk.ijse.back_end.dto.LoginRequestDTO;
import lk.ijse.back_end.dto.UserDTO;
import lk.ijse.back_end.service.UserService;
import lk.ijse.back_end.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin // Frontend (HTML/JS) eka ekka communication allow karanna
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 1. User Registration Endpoint
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        try {
            UserDTO registeredUser = userService.registerUser(userDTO);
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    // 2. User Login Endpoint (Generates JWT)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Email eken user wa hoyaganna
            var userOptional = userService.findByEmail(loginRequest.getEmail());

            if (userOptional.isPresent()) {
                var user = userOptional.get();

                // Password eka match wenawada kiyala check karanna (BCrypt)
                if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {

                    // JWT Token eka generate karanna
                    String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString());

                    // Token ekai Role ekai return karanna
                    return ResponseEntity.ok(new AuthResponse(token, user.getRole().toString()));
                }
            }

            // Credentials waradi nam unauthorized error ekak dhenna
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login error: " + e.getMessage());
        }
    }
}