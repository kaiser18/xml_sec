package bezbednost.auth;

import javax.validation.constraints.Email;

import bezbednost.validation.ValidPassword;

// DTO za login
public class JwtAuthenticationRequest {
	
	@Email(message="email is not in the valid form")
    private String email;
	
	@ValidPassword
    private String password;
	
	private String verificationCode;

    public JwtAuthenticationRequest() {
        super();
    }

    public JwtAuthenticationRequest(String email, String password, String verificationCode) {
        this.setEmail(email);
        this.setPassword(password);
        this.setVerificationCode(verificationCode);
    }

    public String getVerificationCode() {
		return verificationCode;
	}

	public void setVerificationCode(String verificationCode) {
		this.verificationCode = verificationCode;
	}

	public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
