package bezbednost.service;

import java.util.List;

import bezbednost.domain.ConfirmationToken;
import bezbednost.domain.User;
import bezbednost.domain.UserRequest;
import bezbednost.dto.UserVerificationDTO;


public interface UserService {
    User findById(Long id);
    User findByUsername(String username);
    List<User> findAll ();
	User save(User user);
    User findUserByEmail(String email);
    boolean verifyUser(String token) throws Exception;
    ConfirmationToken createConfirmationToken(User user);
    void createPasswordResetTokenForUser(User user, String token);
	void changeUserPassword(User user, String newPassword);
	User getUserByPasswordResetToken(String token);
	String generateQRUrl(User user);
}
