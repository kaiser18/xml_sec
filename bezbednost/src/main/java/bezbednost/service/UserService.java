package bezbednost.service;

import java.util.List;

import bezbednost.domain.User;
import bezbednost.domain.UserRequest;
import bezbednost.dto.UserVerificationDTO;


public interface UserService {
    User findById(Long id);
    User findByUsername(String username);
    List<User> findAll ();
	User save(User user);
	List<User> findAllDerms();
	List<User> findAllPharms();
    User findUserByEmail(String email);
    void verifyUser(UserVerificationDTO verificationData) throws Exception;
}
