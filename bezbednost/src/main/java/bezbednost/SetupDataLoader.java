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
        Privilege readPostPrivilege
        = createPrivilegeIfNotFound("READ_POST_PRIVILEGE");
        Privilege writePostPrivilege
        = createPrivilegeIfNotFound("WRITE_POST_PRIVILEGE");
 
        List<Privilege> adminPrivileges = Arrays.asList(
        		readCertPrivilege, createCertPrivilege, readAllCertPrivilege, readAllSignPrivilege, createCertPrivilege, revokeCertPrivilege, genKeystorePrivilege, deleteKeystorePrivilege, readPostPrivilege, writePostPrivilege);
        createRoleIfNotFound("ROLE_ADMIN", adminPrivileges);
        createRoleIfNotFound("ROLE_USER", Arrays.asList(createCertPrivilege, readPostPrivilege, writePostPrivilege));


        Role adminRole = roleRepository.findRoleByName("ROLE_ADMIN"); 
        User user = new User();
        user.setFirstName("Test");
        user.setLastName("Test");
        user.setPassword(passwordEncoder.encode("test"));
        user.setEmail("test@test.com");
        user.setRoles(Arrays.asList(adminRole));
        user.setEnabled(true);
        userRepository.save(user);
        
        Role userRole = roleRepository.findRoleByName("ROLE_USER");
        User u = new User();
        u.setFirstName("Nikola");
        u.setLastName("Blesic");
        u.setPassword(passwordEncoder.encode("Nikola123."));
        u.setEmail("nikola@nikola.com");
        u.setSecret("QGJQOZDYG7FGVLHP");
        u.setRoles(Arrays.asList(userRole));
        u.setEnabled(true);
        userRepository.save(u);

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
