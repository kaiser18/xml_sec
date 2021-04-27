package bezbednost.domain;

import java.util.Collection;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.JoinColumn;

@Entity
public class Role {
	 	@Id
	 	@GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String name;

	    @ManyToMany(fetch=FetchType.EAGER)
	    @JoinTable(
	        name = "roles_privileges", 
	        joinColumns = @JoinColumn(
	          name = "role_id", referencedColumnName = "id"), 
	        inverseJoinColumns = @JoinColumn(
	          name = "privilege_id", referencedColumnName = "id"))
	    private Collection<Privilege> privileges;   

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}


		public Collection<Privilege> getPrivileges() {
			return privileges;
		}

		public void setPrivileges(Collection<Privilege> privileges) {
			this.privileges = privileges;
		}

		public void setPrivileges(List<Privilege> privileges) {
			this.privileges = privileges;
		}

		public Role() {
			super();
			// TODO Auto-generated constructor stub
		}

		public Role(String name) {
			super();
			this.name = name;
		}  
	    
	    
}
