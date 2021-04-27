package bezbednost.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import bezbednost.domain.*;
import bezbednost.dto.UserVerificationDTO;
import bezbednost.repository.PasswordTokenRepository;
import bezbednost.repository.UserRepository;
import bezbednost.service.UserService;


@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private PasswordTokenRepository passTokenRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public User findByUsername(String username) throws UsernameNotFoundException {
		User u = userRepository.findByUsername(username);
		return u;
	}

	public User findById(Long id) throws AccessDeniedException {
		User u = userRepository.findById(id).orElse(null);
		return u;
	}

	public List<User> findAll() throws AccessDeniedException {
		List<User> result = userRepository.findAll();
		return result;
	}

	public User findUserByEmail (String email) {
		return userRepository.findUserByEmail(email);
	}

	@Override
	public User save(User user) {
		return userRepository.save(user);
	}

	@Override
	public void verifyUser(UserVerificationDTO verificationData) throws Exception {
		// TODO Auto-generated method stub
		
	}
	
	public void createPasswordResetTokenForUser(User user, String token) {
	    PasswordResetToken myToken = new PasswordResetToken(token, user);
	    passTokenRepository.save(myToken);
	}


	public void changeUserPassword(User user, String password) {
	    user.setPassword(passwordEncoder.encode(password));
	    
	    userRepository.save(user);
	}

	@Override
	public User getUserByPasswordResetToken(String token) {
		return userRepository.findUserByToken(token);
	}



}
