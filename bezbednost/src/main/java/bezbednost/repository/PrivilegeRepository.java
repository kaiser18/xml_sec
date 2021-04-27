package bezbednost.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import bezbednost.domain.Privilege;

public interface PrivilegeRepository extends JpaRepository<Privilege, Long>{

	Privilege findPrivilegeByName(String name);

}
