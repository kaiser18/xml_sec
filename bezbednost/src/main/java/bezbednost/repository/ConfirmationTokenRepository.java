package bezbednost.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import bezbednost.domain.ConfirmationToken;

public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken, Integer>{
	ConfirmationToken findByConfirmationToken(String confirmationToken);
}
