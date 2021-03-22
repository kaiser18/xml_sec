package bezbednost.repository;

import org.springframework.data.repository.CrudRepository;

import bezbednost.domain.KeyStoreModel;

public interface KeyStoreRepository extends CrudRepository<KeyStoreModel, Integer> {

	KeyStoreModel findByKsFileName(String ksFileName);
	
}
