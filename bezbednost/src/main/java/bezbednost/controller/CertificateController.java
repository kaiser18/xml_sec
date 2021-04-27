package bezbednost.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import bezbednost.domain.CertificateModel;
import bezbednost.dto.Certificate;
import bezbednost.dto.OtherCertificate;
import bezbednost.service.CertificateService;

@RestController
@RequestMapping(value = "/api/certificate")
public class CertificateController {
	
	@Autowired
	private CertificateService certificateService;
	
	@PreAuthorize("hasAuthority('WRITE_PRIVILEGE')")
	@RequestMapping(value = "/generateRoot", method = RequestMethod.POST, consumes ="application/json", produces="application/json")
	public ResponseEntity<?> generateRoot(@RequestBody Certificate selfSignedCertificateModel) {
		if(selfSignedCertificateModel == null)
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		try {
			certificateService.generateRoot(selfSignedCertificateModel);	
		} catch (Exception e) {
			e.printStackTrace();
		}

		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@RequestMapping(value = "/generateOther", method = RequestMethod.POST, consumes = "application/json", produces = "application/json")
	public ResponseEntity<?> generateOther(@RequestBody OtherCertificate otherCertificate) {
		if(otherCertificate == null)
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		List<String> list = certificateService.getAllSignatures();
		if(!list.contains(otherCertificate.getIssuerAlias()))
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		try {
			certificateService.generateOther(otherCertificate);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@RequestMapping(value = "/getCertificate", method = RequestMethod.GET, headers = { "content-type=application/json" })
	public CertificateModel getCertificate(@RequestBody String serialNum) {
		if(serialNum == null || serialNum.equals(""))
			return null;
		return certificateService.getCertificate(serialNum);
	}
	
	@RequestMapping(value = "/revokeCertificate", method = RequestMethod.POST)
	public ResponseEntity<?> revokeCertificate(@RequestBody String serialNum) {
		if(serialNum == null || serialNum.equals(""))
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		
		if(certificateService.revokeCertificate(serialNum))
			return ResponseEntity.status(HttpStatus.OK).body("Sertifikat je povucen.");
		else
			return ResponseEntity.status(HttpStatus.OK).body("Neuspesno.");
	}
		
	@RequestMapping(value = "/isRevoked", method = RequestMethod.GET)
	public ResponseEntity<Boolean> isRevoked(String serialNum) {
		if(serialNum == null || serialNum.equals(""))
			return null;
		return new ResponseEntity<>(certificateService.isRevoked(serialNum), HttpStatus.OK);
	}
	
	@RequestMapping(value="/getAllSignatures", method = RequestMethod.GET, produces="application/json")
	public ArrayList<String> getAllSignatures(HttpServletRequest request) {
		return certificateService.getAllSignatures();
	}
	
	@RequestMapping(value = "/getAllCertificates", method = RequestMethod.GET)
	public List<CertificateModel> getAllCertificates(HttpServletRequest request) {
		return certificateService.getAllCertificates();
	}
	
	@RequestMapping(value = "/getAllCertificatesByEmail", method = RequestMethod.GET)
	public List<CertificateModel> getAllCertificatesByEmail(String email) {
		return certificateService.getAllCertificatesByEmail(email);
	}
	
	@RequestMapping(value = "/isVerified", method = RequestMethod.GET)
	public boolean isVerified(String alias) {
		return certificateService.isVerified(alias);
	}
	
}
