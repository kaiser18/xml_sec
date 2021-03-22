package bezbednost.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import bezbednost.domain.User;


public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername( String username );
    
    @Query("from User u join u.authorities a where a.id=3")
	List<User> findAllDerms();
    
    @Query("from User u join u.authorities a where a.id=4")
	List<User> findAllPharms();
    
    User findUserByEmail(String email);
    
}

