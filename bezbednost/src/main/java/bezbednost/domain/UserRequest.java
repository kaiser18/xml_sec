package bezbednost.domain;

public class UserRequest {
	private final int PASSWORD_LENGTH = 6;

	private Long id;

	private String username;

	private String email;

	private String password;

	private String firstname;

	private String lastname;

	public UserRequest() {
	}

	public UserRequest(User p) {
		this.id = p.getId();
		this.email = p.getEmail();
		this.username = p.getUsername();
		this.firstname = p.getFirstName();
		this.lastname = p.getLastName();
	}

    public void registerValidation() throws Exception {
		if(email.isEmpty() || password.isEmpty() || firstname.isEmpty() || lastname.isEmpty() || password == null || password.length() < PASSWORD_LENGTH)
			throw new Exception("Validation failed");
	}

	public void updateValidation() throws Exception {
		if(email.isEmpty() || firstname.isEmpty() || lastname.isEmpty())
			throw new Exception("Validation failed");
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFirstname() {
		return firstname;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

}
