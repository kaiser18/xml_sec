package bezbednost;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import bezbednost.domain.Privilege;
import bezbednost.domain.Role;
import bezbednost.domain.User;
import bezbednost.repository.PrivilegeRepository;
import bezbednost.repository.RoleRepository;
import bezbednost.repository.UserRepository;

@Component
public class SetupDataLoader implements
  ApplicationListener<ContextRefreshedEvent> {

    boolean alreadySetup = false;

    @Autowired
    private UserRepository userRepository;
 
    @Autowired
    private RoleRepository roleRepository;
 
    @Autowired
    private PrivilegeRepository privilegeRepository;
 
    @Autowired
    private PasswordEncoder passwordEncoder;
 
    @Override
    @Transactional
    public void onApplicationEvent(ContextRefreshedEvent event) {
 
    	//alreadySetup = true;
        if (alreadySetup)
            return;
        Privilege readCertPrivilege
          = createPrivilegeIfNotFound("READ_CERT_PRIVILEGE");
        Privilege readAllCertPrivilege
        = createPrivilegeIfNotFound("READ_ALL_CERT_PRIVILEGE");
        Privilege readAllSignPrivilege
        = createPrivilegeIfNotFound("READ_ALL_SIGN_PRIVILEGE");
        Privilege createCertPrivilege
          = createPrivilegeIfNotFound("CREATE_CERT_PRIVILEGE");
        Privilege revokeCertPrivilege
        = createPrivilegeIfNotFound("REVOKE_CERT_PRIVILEGE");
        Privilege genKeystorePrivilege
        = createPrivilegeIfNotFound("GENERATE_KEYSTORE_PRIVILEGE");
        Privilege deleteKeystorePrivilege
        = createPrivilegeIfNotFound("DELETE_KEYSTORE_PRIVILEGE");
        Privilege adminPrivilege
        = createPrivilegeIfNotFound("ADMIN_PRIVILEGE");
        Privilege userPrivilege
        = createPrivilegeIfNotFound("USER_PRIVILEGE");
 
        List<Privilege> adminPrivileges = Arrays.asList(
        		readCertPrivilege, createCertPrivilege, readAllCertPrivilege, readAllSignPrivilege, createCertPrivilege, revokeCertPrivilege, genKeystorePrivilege, deleteKeystorePrivilege, adminPrivilege, userPrivilege);
        createRoleIfNotFound("ROLE_ADMIN", adminPrivileges);
        createRoleIfNotFound("ROLE_USER", Arrays.asList(createCertPrivilege, userPrivilege));


        Role adminRole = roleRepository.findRoleByName("ROLE_ADMIN"); 
        User user = new User();
        user.setFirstName("Test");
        user.setLastName("Test");
        user.setPassword(passwordEncoder.encode("test"));
        user.setEmail("test@test.com");
        user.setUsername("test");
        user.setRoles(Arrays.asList(adminRole));
        user.setEnabled(true);
        userRepository.save(user);
        
        Role userRole = roleRepository.findRoleByName("ROLE_USER");
        User u = new User();
        u.setFirstName("Nikola");
        u.setLastName("Blesic");
        u.setPassword(passwordEncoder.encode("test"));
        u.setEmail("nikola@nikola.com");
        u.setUsername("nikola");
        u.setSecret("QGJQOZDYG7FGVLHP");
        u.setRoles(Arrays.asList(userRole));
        u.setEnabled(true);
        userRepository.save(u);

        User m = new User();
        m.setFirstName("Helena");
        m.setLastName("Anisic");
        m.setPassword(passwordEncoder.encode("test"));
        m.setEmail("helena@helena.com");
        m.setUsername("helena");
        m.setSecret("QGJQOZDYG7FGVKHP");
        m.setRoles(Arrays.asList(userRole));
        m.setEnabled(true);
        userRepository.save(m);
        
        User k = new User();
        k.setFirstName("Mihailo");
        k.setLastName("Ivic");
        k.setPassword(passwordEncoder.encode("test"));
        k.setEmail("mihailo@mihailo.com");
        k.setUsername("mihailo");
        k.setSecret("QGJQOZDYG7FKVKHP");
        k.setRoles(Arrays.asList(userRole));
        k.setEnabled(true);
        userRepository.save(k);
        
        User f = new User();
        f.setFirstName("Jovan");
        f.setLastName("Timarac");
        f.setPassword(passwordEncoder.encode("test"));
        f.setEmail("jovan@jovan.com");
        f.setUsername("jovan");
        f.setSecret("QGJQOZFYG7FKVKHP");
        f.setRoles(Arrays.asList(userRole));
        f.setEnabled(true);
        userRepository.save(f);
        
        alreadySetup = true;
    }

    @Transactional
    Privilege createPrivilegeIfNotFound(String name) {
 
        Privilege privilege = privilegeRepository.findPrivilegeByName(name);
        if (privilege == null) {
            privilege = new Privilege(name);
            privilegeRepository.save(privilege);
        }
        return privilege;
    }

    @Transactional
    Role createRoleIfNotFound(
      String name, List<Privilege> privileges) {
 
        Role role = roleRepository.findRoleByName(name);
        if (role == null) {
            role = new Role(name);
            role.setPrivileges(privileges);
            roleRepository.save(role);
        }
        return role;
    }
}
