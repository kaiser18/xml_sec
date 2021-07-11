package bezbednost.async.service;

import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import bezbednost.domain.User;

@Service
public class EmailService {
	@Autowired
	private JavaMailSender javaMailSender;
	
	@Autowired
	private Environment env;
	
	@Async
	public void sendPasswordResetEmail(User user, String token, String clientURI) throws MailException{

		try {
			MimeMessage mimeMessage = javaMailSender.createMimeMessage();
			mimeMessage.setContent(
					"<p>Click this link to reset your password: <a href=\""+clientURI+"?token=" + token
							+"\">RESET PASSWORD</a></p>", "text/html");
			MimeMessageHelper mail = new MimeMessageHelper(mimeMessage, "utf-8");
			mail.setTo(user.getEmail());
			System.out.println(user.getEmail());
			if (env.getProperty("spring.mail.username") == null) {
				return;
			}
			mail.setFrom(env.getProperty("spring.mail.username"));
			mail.setSubject("Reset password");

			javaMailSender.send(mimeMessage);
		} catch (Exception e) {
			System.out.println(e.getMessage());
			return;
		} 
	}
	
	@Async
	public void sendConfirmationEmail(User user, String token, String clientURI, String QRUrl) throws MailException {
		try {
			MimeMessage mimeMessage = javaMailSender.createMimeMessage();
			mimeMessage.setContent("<p>Click this link to complete your registration: <a href=\"https://localhost:4200/verify?token=" + token
					+ "\">Verify</a></p><br><br><h3>Set up Google Authenticator</h3><br><h5>"
					+ "1. On your phone, install the Google Authenticator app<br>"
					+ "2. In the app, tap Get Started<br>"
					+ "3. Click the \"+\" (plus sign)<br>"
					+ "4. Click scan a QR Code<br>"
					+ "5. Scan this QR Code:</h5><br>"
					+ "<img src=\"" + QRUrl + "\" alt=\"img\" />", "text/html");
			MimeMessageHelper mail = new MimeMessageHelper(mimeMessage, "utf-8");
			mail.setTo(user.getEmail());
			
			if (env.getProperty("spring.mail.username") == null) {
				return;
			}
			mail.setFrom(env.getProperty("spring.mail.username"));
			mail.setSubject("Verify your account");
			
			javaMailSender.send(mimeMessage);
		} catch(Exception e) {
			System.out.println(e.getMessage());
			return;
		}
		
	}
}
