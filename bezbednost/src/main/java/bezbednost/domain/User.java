package bezbednost.domain;

import static javax.persistence.InheritanceType.TABLE_PER_CLASS;

import java.sql.Timestamp;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Version;
import javax.validation.constraints.Size;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;



// POJO koji implementira Spring Security UserDetails interfejs koji specificira
// osnovne osobine Spring korisnika (koje role ima, da li je nalog zakljucan, istekao, da li su kredencijali istekli)
@Entity
@Table(name="USERS")
@Inheritance(strategy=TABLE_PER_CLASS)
public class User implements UserDetails {

	private static final long serialVersionUID = 1L;
	
	@Id
	@SequenceGenerator(name = "mySeqGenV3", sequenceName = "mySeqV3", initialValue = 200, allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "mySeqGenV3")
    @Column(name = "id", unique=true, nullable=false)
    private Long id;

    @Column(name = "username", unique=true)
    private String username;

    @JsonIgnore
    @Column(name = "password")
    private String password;

    @Size(min=2, max=50)
    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Size(min=2, max=50)
    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "email", unique=true)
    private String email;

    @Column(name = "enabled")
    private boolean enabled = false;
    

    @Column(name = "last_password_reset_date")
    private Timestamp lastPasswordResetDate;
    
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_authority",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "authority_id", referencedColumnName = "id"))
    private List<Authority> authorities;

    public User(){
    }

    public User(UserRequest userRequest) {
        this.id = userRequest.getId();
        this.email = userRequest.getEmail();
        this.firstName = userRequest.getFirstname();
        this.lastName = userRequest.getLastname();
        this.username = userRequest.getUsername();
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        Timestamp now = new Timestamp(new Date().getTime());
        this.setLastPasswordResetDate(now);
        this.password = password;
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

    public void setAuthorities(List<Authority> authorities) {
        this.authorities = authorities;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public Timestamp getLastPasswordResetDate() {
        return lastPasswordResetDate;
    }

    public void setLastPasswordResetDate(Timestamp lastPasswordResetDate) {
        this.lastPasswordResetDate = lastPasswordResetDate;
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    

    public void setPasswordForReset(String password) {
        this.password = password;
    }
}
