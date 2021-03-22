package bezbednost.service.impl;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import bezbednost.domain.User;
import bezbednost.repository.UserRepository;


// Ovaj servis je namerno izdvojen kao poseban u ovom primeru.
// U opstem slucaju UserServiceImpl klasa bi mogla da implementira UserDetailService interfejs.
@Service
public class CustomUserDetailsService implements UserDetailsService {

	protected final Log LOGGER = LogFactory.getLog(getClass());

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private AuthenticationManager authenticationManager;

	// Funkcija koja na osnovu username-a iz baze vraca objekat User-a
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		User user = userRepository.findUserByEmail(email);
		if (user == null) {
			throw new UsernameNotFoundException(String.format("No user found with email '%s'.", email));
		} else {
			return user;
		}
	}

	public void changePassword(String oldPassword, String newPassword) throws Exception {
		User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if(currentUser == null)
			throw new Exception("User not found");
		String email = currentUser.getEmail();
		if (authenticationManager != null) {
			LOGGER.debug("Re-authenticating user '" + email + "' for password change request.");
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, oldPassword));
		} else {
			LOGGER.debug("No authentication manager set. can't change Password!");
			return;
		}
		LOGGER.debug("Changing password for user '" + email + "'");
		User user = (User) loadUserByUsername(email);
		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		user.setPassword(passwordEncoder.encode(newPassword));
		userRepository.save(user);
	}
}
