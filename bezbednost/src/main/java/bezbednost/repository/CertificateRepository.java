package bezbednost.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import bezbednost.domain.CertificateModel;

public interface CertificateRepository extends CrudRepository<CertificateModel, Integer> {

	CertificateModel findBySerialNum(String serialNum);
	CertificateModel findByAlias(String alias);
	List<CertificateModel> findAllByEmail(String email);
	
}
