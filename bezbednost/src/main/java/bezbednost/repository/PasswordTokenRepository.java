package bezbednost.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import bezbednost.domain.PasswordResetToken;
import bezbednost.domain.RevokedCertificate;

public interface PasswordTokenRepository extends JpaRepository<PasswordResetToken, Integer>{
	PasswordResetToken findByToken(String token);

	void deleteByToken(String token);
}
