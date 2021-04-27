package bezbednost.dto;

public class ResetPasswordDTO {
    private  String token;

   // @ValidPassword
    private String newPassword;

    private String confirmPassword;
    
	public ResetPasswordDTO(String token, String newPassword, String confirmPassword) {
		super();
		this.token = token;
		this.newPassword = newPassword;
		this.confirmPassword = confirmPassword;
	}

	public String getConfirmPassword() {
		return confirmPassword;
	}

	public void setConfirmPassword(String confirmPassword) {
		this.confirmPassword = confirmPassword;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}

	public ResetPasswordDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
    
    
}
