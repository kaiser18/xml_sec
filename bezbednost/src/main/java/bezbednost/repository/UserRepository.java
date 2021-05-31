package bezbednost.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import bezbednost.domain.User;


public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername( String username );
       
    User findUserByEmail(String email);

    @Query("from User u join u.resetTokens r where r.token=?1")
	User findUserByToken(String token);
    
}

