package bezbednost.repository;

import org.springframework.data.repository.CrudRepository;

import bezbednost.domain.CertificateModel;

public interface CertificateRepository extends CrudRepository<CertificateModel, Integer> {

	CertificateModel findBySerialNum(String serialNum);
	CertificateModel findByAlias(String alias);
	
}
