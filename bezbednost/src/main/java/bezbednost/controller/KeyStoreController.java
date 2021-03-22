package bezbednost.controller;

import java.io.FileOutputStream;
import java.io.IOException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.cert.CertificateException;
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import bezbednost.domain.KeyStoreModel;
import bezbednost.repository.KeyStoreRepository;

@RestController
@RequestMapping("/api/keystore")
public class KeyStoreController {

	@Autowired
	private KeyStoreRepository keyStoreRep;
	
	public ArrayList<String> keystores = new ArrayList<>();

	
	@RequestMapping(value = "/generateKeystore", method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<?> generateKeystore(@RequestBody KeyStoreModel ks) {
		try {
			KeyStore keyStore = KeyStore.getInstance("JKS", "SUN");
			String fileName = ks.getKsFileName();
			String password = ks.getKsPassword();
			System.out.println(fileName);
			System.out.println(password);
			keyStore.load(null, password.toCharArray());
			keyStore.store(new FileOutputStream(fileName+".jks"), password.toCharArray());
			KeyStoreModel ksd = new KeyStoreModel(fileName,password);
			keyStoreRep.save(ksd);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	
	@RequestMapping(value = "/getKeystores", method = RequestMethod.GET)
	public ArrayList<String> getKeystores(HttpServletRequest request) throws KeyStoreException, NoSuchProviderException, NoSuchAlgorithmException, CertificateException, IOException {
		keystores.clear();

		ArrayList<KeyStoreModel> lista = (ArrayList<KeyStoreModel>) keyStoreRep.findAll();
		for(KeyStoreModel ksd:lista) {
				keystores.add(ksd.getKsFileName());
		}
		
		return keystores;
	}
	
}
