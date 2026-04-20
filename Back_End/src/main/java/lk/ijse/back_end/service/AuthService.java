package lk.ijse.back_end.service;


import lk.ijse.back_end.dto.AuthResponseDTO;
import lk.ijse.back_end.dto.LoginRequestDTO;
import lk.ijse.back_end.dto.UserDTO;

public interface AuthService {
    UserDTO register(UserDTO userDTO);
    AuthResponseDTO login(LoginRequestDTO loginRequest);
}