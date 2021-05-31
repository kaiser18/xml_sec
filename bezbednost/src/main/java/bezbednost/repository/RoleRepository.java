package bezbednost.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import bezbednost.domain.Role;

public interface RoleRepository extends JpaRepository<Role, Long>{

	Role findRoleByName(String name);

}
