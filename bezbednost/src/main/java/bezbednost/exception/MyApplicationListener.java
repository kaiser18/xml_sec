package bezbednost.exception;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import bezbednost.controller.LoggingController;



@Component
public class MyApplicationListener implements ApplicationListener<AuthenticationFailureBadCredentialsEvent> {
	@Autowired
	private LoggingController logger;

	 @Autowired
	private PasswordEncoder passwordEncoder;
	 
    @Override
    public void onApplicationEvent(AuthenticationFailureBadCredentialsEvent event) {
        Object userName = event.getAuthentication().getPrincipal();
        Object credentials = event.getAuthentication().getCredentials();
        logger.LOGGER.warn("Failed authentication using USERNAME [" + userName + "] and PASSWORD [" + passwordEncoder.encode(credentials.toString()) + "]");
    }
}