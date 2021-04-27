package bezbednost.dto;

public class ForgotPassDTO {
	private String email;
	private String clientURI;
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getClientURI() {
		return clientURI;
	}
	public void setClientURI(String clientURI) {
		this.clientURI = clientURI;
	}
	public ForgotPassDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public ForgotPassDTO(String email, String clientURI) {
		super();
		this.email = email;
		this.clientURI = clientURI;
	}
	
	
}
