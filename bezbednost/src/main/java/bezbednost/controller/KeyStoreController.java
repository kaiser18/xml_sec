package bezbednost.controller;

import java.io.FileOutputStream;
import java.security.KeyStore;
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import static bezbednost.keystores.KeyStore.*;

@RestController
@RequestMapping("/api/keystore")
public class KeyStoreController {
	
	public ArrayList<String> keystores = new ArrayList<>();

	@RequestMapping(value = "/generateKeystore", method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<?> generateKeystore() {
		try {
			KeyStore keyStore = KeyStore.getInstance("JKS", "SUN");
			String fileName = "root";
			String password = "root";
			System.out.println(fileName);
			System.out.println(password);
			keyStore.load(null, password.toCharArray());
			keyStore.store(new FileOutputStream(fileName+".jks"), password.toCharArray());
		} catch (Exception e) {
			e.printStackTrace();
		}

		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@RequestMapping(value = "/deleteAll", method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<?> deleteAll(HttpServletRequest request) {
		try {
			KeyStore keyStore = KeyStore.getInstance("JKS", "SUN");
			String fileName = ROOT_FILE;
			String password = ROOT_PASS;
			keyStore.load(null, password.toCharArray());
			keyStore.store(new FileOutputStream(fileName+".jks"), password.toCharArray());
			
			keyStore = KeyStore.getInstance("JKS", "SUN");
			fileName = INTER_FILE;
			password = INTER_PASS;
			keyStore.load(null, password.toCharArray());
			keyStore.store(new FileOutputStream(fileName+".jks"), password.toCharArray());
			
			keyStore = KeyStore.getInstance("JKS", "SUN");
			fileName = END_FILE;
			password = END_PASS;
			keyStore.load(null, password.toCharArray());
			keyStore.store(new FileOutputStream(fileName+".jks"), password.toCharArray());
		} catch (Exception e) {
			e.printStackTrace();
		}

		return new ResponseEntity<>(HttpStatus.OK);
	}
	
}
