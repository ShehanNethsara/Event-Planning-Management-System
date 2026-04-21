package lk.ijse.back_end.service;

import lk.ijse.back_end.dto.UserDTO;
import java.util.List;

public interface UserService {
    UserDTO registerUser(UserDTO userDTO);
    UserDTO getUserDetails(String email);
    List<UserDTO> getAllUsers(); // Admin ට ඕන වෙනවා
}