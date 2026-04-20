package lk.ijse.back_end.controller;

import lk.ijse.back_end.dto.AuthResponseDTO;
import lk.ijse.back_end.dto.LoginRequestDTO;
import lk.ijse.back_end.dto.UserDTO;
import lk.ijse.back_end.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin // Frontend එකයි Backend එකයි අතර සම්බන්ධතාවයට මේක අනිවාර්යයි
public class AuthController {

    @Autowired
    private AuthService authService;

    // User කෙනෙක්ව register කරන Endpoint එක
    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(authService.register(userDTO));
    }

    // Login වෙලා JWT Token එක ලබාගන්නා Endpoint එක
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }
}