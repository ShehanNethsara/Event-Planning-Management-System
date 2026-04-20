package lk.ijse.back_end.service.impl;

import lk.ijse.back_end.dto.AuthResponseDTO;
import lk.ijse.back_end.dto.LoginRequestDTO;
import lk.ijse.back_end.dto.UserDTO;
import lk.ijse.back_end.entity.User;
import lk.ijse.back_end.repository.UserRepository;
import lk.ijse.back_end.service.AuthService;
import lk.ijse.back_end.util.JwtUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public UserDTO register(UserDTO userDTO) {
        // Email එක කලින් පාවිච්චි කරලාද බලන්න
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        // Entity එකට map කරලා password එක encrypt කරන්න
        User user = modelMapper.map(userDTO, User.class);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        User savedUser = userRepository.save(user);
        return modelMapper.map(savedUser, UserDTO.class);
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO loginRequest) {
        // User ඉන්නවද බලන්න
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        // Password එක match වෙනවද බලන්න
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials!");
        }

        // JWT Token එක generate කරන්න
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString());

        return new AuthResponseDTO(token, user.getRole().toString());
    }
}