package bezbednost.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import bezbednost.auth.JwtAuthenticationRequest;
import bezbednost.domain.User;
import bezbednost.domain.UserRequest;
import bezbednost.domain.UserTokenState;
import bezbednost.dto.UserVerificationDTO;
import bezbednost.exception.ResourceConflictException;
import bezbednost.security.TokenUtils;
import bezbednost.service.UserService;
import bezbednost.service.impl.CustomUserDetailsService;

@RestController
@RequestMapping(value = "/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthenticationController {

    @Autowired
    private TokenUtils tokenUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private UserService userService;

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

            return new ResponseEntity<>(this.userService.save(userRequest), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Boolean> verifyUser(@RequestBody UserVerificationDTO verificationData) {
        try {
            this.userService.verifyUser(verificationData);
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

    @PostMapping(value = "/change-password", consumes = "application/json")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChanger passwordChanger) {
        try {
            userDetailsService.changePassword(passwordChanger.oldPassword, passwordChanger.newPassword);
            Map<String, String> result = new HashMap<>();
            result.put("result", "success");
            return ResponseEntity.accepted().body(result);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
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
    
}
