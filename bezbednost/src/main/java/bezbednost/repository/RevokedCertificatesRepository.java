package bezbednost.repository;

import org.springframework.data.repository.CrudRepository;

import bezbednost.domain.RevokedCertificate;

public interface RevokedCertificatesRepository  extends CrudRepository<RevokedCertificate, Integer>  {
	RevokedCertificate findBySerialNum(String serialNum);
}
