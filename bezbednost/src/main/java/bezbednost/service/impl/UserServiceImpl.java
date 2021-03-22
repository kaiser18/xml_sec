package bezbednost.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import bezbednost.domain.*;
import bezbednost.dto.UserVerificationDTO;
import bezbednost.repository.UserRepository;
import bezbednost.service.UserService;


@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepository;

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
	
	public List<User> findAllDerms(){
		List<User> result = userRepository.findAllDerms();
		return result;
	}
	
	public List<User> findAllPharms(){
		List<User> result = userRepository.findAllPharms();
		return result;
	}

	@Override
	public User save(UserRequest userRequest) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void verifyUser(UserVerificationDTO verificationData) throws Exception {
		// TODO Auto-generated method stub
		
	}

}
