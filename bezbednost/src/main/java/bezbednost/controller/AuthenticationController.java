package bezbednost.controller;

import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import bezbednost.async.service.EmailService;
import bezbednost.auth.JwtAuthenticationRequest;
import bezbednost.domain.ConfirmationToken;
import bezbednost.domain.GenericResponse;
import bezbednost.domain.PasswordResetToken;
import bezbednost.domain.Role;
import bezbednost.domain.User;
import bezbednost.domain.UserRequest;
import bezbednost.domain.UserTokenState;
import bezbednost.dto.ForgotPassDTO;
import bezbednost.dto.ResetPasswordDTO;
import bezbednost.dto.UserVerificationDTO;
import bezbednost.exception.ResourceConflictException;
import bezbednost.repository.PasswordTokenRepository;
import bezbednost.repository.RoleRepository;
import bezbednost.security.TokenUtils;
import bezbednost.service.UserService;
import bezbednost.service.impl.CustomUserDetailService;

@RestController
@RequestMapping(value = "/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthenticationController {

    @Autowired
    private TokenUtils tokenUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailService userDetailsService;

    @Autowired
    private UserService userService;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
	private PasswordEncoder passwordEncoder;
    
    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordTokenRepository passTokenRepository;
    
    @PostMapping("/login")
    public ResponseEntity<UserTokenState> createAuthenticationToken(
            @RequestBody JwtAuthenticationRequest authenticationRequest, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                authenticationRequest.getEmail(), authenticationRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = (User) authentication.getPrincipal();
        String jwt = tokenUtils.generateToken(user.getEmail());
        int expiresIn = tokenUtils.getExpiredIn();

        return ResponseEntity.ok(new UserTokenState(jwt, expiresIn, user));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> addUser(@RequestBody UserRequest userRequest) {
        try {
            userRequest.registerValidation();
            User existUser = this.userService.findUserByEmail(userRequest.getEmail());
            if (existUser != null)
                throw new ResourceConflictException(userRequest.getId(), "Username already exists");
	            User user = new User();
	        	user.setEmail(userRequest.getEmail());
	        	user.setUsername(userRequest.getUsername());
	        	user.setFirstName(userRequest.getFirstname());
	        	user.setLastName(userRequest.getLastname());
	        	user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
	        	user.setRoles(Arrays.asList(roleRepository.findRoleByName("ROLE_USER")));
	        	
	        	ConfirmationToken token = userService.createConfirmationToken(user);
	        	emailService.sendConfirmationEmail(user, token.getConfirmationToken(), userRequest.getClientURI());
            return new ResponseEntity<>(this.userService.save(user), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Boolean> verifyUser(@RequestBody String token) {
        try {
            this.userService.verifyUser(token);
            return new ResponseEntity<>(true, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(value = "/refresh")
    public ResponseEntity<UserTokenState> refreshAuthenticationToken(HttpServletRequest request) {

        String token = tokenUtils.getToken(request);
        String email = this.tokenUtils.getEmailFromToken(token);
        User user = (User) this.userDetailsService.loadUserByUsername(email);

        if (this.tokenUtils.canTokenBeRefreshed(token, user.getLastPasswordResetDate())) {
            String refreshedToken = tokenUtils.refreshToken(token);
            int expiresIn = tokenUtils.getExpiredIn();

            return ResponseEntity.ok(new UserTokenState(refreshedToken, expiresIn, user));
        } else {
            UserTokenState userTokenState = new UserTokenState();
            return ResponseEntity.badRequest().body(userTokenState);
        }
    }

    @PostMapping("/logout")
    public void logout() {
        SecurityContextHolder.clearContext();
    }

    @GetMapping("/getRole")
    public ResponseEntity<String> getRole() {
        if (SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_DERM"))) {
            return ResponseEntity.ok("DERM");
        } else if (SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_PHARM"))) {
            return ResponseEntity.ok("PHARM");
        } else if (SecurityContextHolder.getContext().getAuthentication()

                .getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.ok("ADMIN");
        } else if (SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_PATIENT"))) {
            return ResponseEntity.ok("PATIENT");
        } else if (SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SYS_ADMIN"))) {
            return ResponseEntity.ok("SYS_ADMIN");
        } else if (SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPL"))) {
            return ResponseEntity.ok("SUPL");
        }
        return ResponseEntity.ok("NONE");
    }

    static class PasswordChanger {
        public String oldPassword;
        public String newPassword;
    }
    
    @PostMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(HttpServletRequest request, 
    		  @RequestBody ForgotPassDTO forgotPassDto) throws Exception {
    	User user = userService.findUserByEmail(forgotPassDto.getEmail());
    	
    	if(user == null) {
    		return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    	}
    	System.out.println(user.getFirstName());
    	String token = UUID.randomUUID().toString();
    	userService.createPasswordResetTokenForUser(user, token);
    	emailService.sendPasswordResetEmail(user, token, forgotPassDto.getClientURI());
    	return new ResponseEntity<>(HttpStatus.OK);
    	
    }
    
    @PostMapping("/changePassword")
    public ResponseEntity<?> showChangePasswordPage(@RequestBody ResetPasswordDTO passwordDto) {
    	System.out.println("usoooo");
    	System.out.println(passwordDto.getConfirmPassword());
    	System.out.println(passwordDto.getNewPassword());
    	if(!passwordDto.getConfirmPassword().equals(passwordDto.getNewPassword())) {
    		System.out.println("ovdeee1");
    		return ResponseEntity.badRequest().body("slflsehfl");
    	}
        String result = validatePasswordResetToken(passwordDto.getToken());
        if(result != null) {
        	return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } else {
        	User user = userService.getUserByPasswordResetToken(passwordDto.getToken());
            if(user != null) {
                userService.changeUserPassword(user, passwordDto.getNewPassword());
                PasswordResetToken token = passTokenRepository.findByToken(passwordDto.getToken()); 
                passTokenRepository.delete(token);
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
            	System.out.println("ovdeee2");
            	return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }
    }
    
    
    public String validatePasswordResetToken(String token) {
        final PasswordResetToken passToken = passTokenRepository.findByToken(token);

        return !isTokenFound(passToken) ? "invalidToken"
                : isTokenExpired(passToken) ? "expired"
                : null;
    }

    private boolean isTokenFound(PasswordResetToken passToken) {
        return passToken != null;
    }

    private boolean isTokenExpired(PasswordResetToken passToken) {
        final Calendar cal = Calendar.getInstance();
        return passToken.getExpiryDate().before(cal.getTime());
    }
    

    
}
