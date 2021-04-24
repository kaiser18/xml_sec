package bezbednost.dto;
import bezbednost.domain.User;

public class UserDTO {
	private Long id;
	private String username;
	private String firstName;
	private String lastName;
	private String email;
	
	public UserDTO() {

	}

	public UserDTO(Long id, String username, String firstName, String lastName, String email) {
		super();
		this.id = id;
		this.username = username;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
	}
	
	public UserDTO(User user) {
		this(user.getId(), user.getUsername(), user.getFirstName(), user.getLastName(), user.getEmail());
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

}
