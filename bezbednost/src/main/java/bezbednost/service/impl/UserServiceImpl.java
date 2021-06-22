package bezbednost.service.impl;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import bezbednost.domain.*;
import bezbednost.repository.ConfirmationTokenRepository;
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
	
	@Autowired
	private ConfirmationTokenRepository confirmationTokenRepository;

	public static String QR_PREFIX = 
			  "https://chart.googleapis.com/chart?chs=200x200&chld=M%%7C0&cht=qr&chl=";

	@Override
	public String generateQRUrl(User user) {
		try {
			return QR_PREFIX + URLEncoder.encode(String.format("otpauth://totp/%s:%s?secret=%s&issuer=%s",
					"nistagram", user.getEmail(), user.getSecret(), "nistagram"), "UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			return "";
		}
	}
	
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
	public boolean verifyUser(String token) throws Exception {
		ConfirmationToken confirmationToken = confirmationTokenRepository.findByConfirmationToken(token);
		System.out.println(confirmationToken);
		if (confirmationToken == null || confirmationToken.getExpiryDate().before(new Date(System.currentTimeMillis()))) {
			throw new Exception("Token is not valid!");
		}
		
		User user = userRepository.getOne(confirmationToken.getUser().getId());
		if (user == null) {
			return false;
		}
		
		user.setEnabled(true);
		userRepository.save(user);
		
		confirmationTokenRepository.delete(confirmationToken);
		
		return true;
	}
	
	public ConfirmationToken createConfirmationToken(User user) {
		ConfirmationToken confirmationToken = new ConfirmationToken(user);
		confirmationTokenRepository.save(confirmationToken);
		return confirmationToken;
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

	@Override
	public void blockUser(User user) {
		user.setBlocked(true);
		userRepository.save(user);
	}



}
