package lk.ijse.back_end.controller;

import lk.ijse.back_end.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        // Admin ට පෙන්වීමට සියලුම පරිශීලකයන් ලබා ගැනීම
        return ResponseEntity.ok(userService.getAllUsers());
    }
}