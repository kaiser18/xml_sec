package bezbednost.service;

import java.util.List;

import bezbednost.domain.Authority;


public interface AuthorityService {
	List<Authority> findById(Long id);
	List<Authority> findByname(String name);
}
