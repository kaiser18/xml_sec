package bezbednost.service.impl;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.math.BigInteger;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.KeyStore;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.PrivateKey;
import java.security.SecureRandom;
import java.security.Security;
import java.security.cert.Certificate;
import java.security.cert.CertificateEncodingException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.bouncycastle.asn1.ASN1ObjectIdentifier;
import org.bouncycastle.asn1.DERIA5String;
import org.bouncycastle.asn1.x500.X500NameBuilder;
import org.bouncycastle.asn1.x500.style.BCStyle;
import org.bouncycastle.asn1.x509.AccessDescription;
import org.bouncycastle.asn1.x509.AuthorityInformationAccess;
import org.bouncycastle.asn1.x509.GeneralName;
import org.bouncycastle.cert.CertIOException;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.X509v3CertificateBuilder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.cert.jcajce.JcaX509v3CertificateBuilder;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.OperatorCreationException;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import bezbednost.domain.CertificateModel;
import bezbednost.domain.RevokedCertificate;
import bezbednost.dto.IssuerData;
import bezbednost.dto.OtherCertificate;
import bezbednost.dto.SubjectData;
import bezbednost.keystores.KeyStoreReader;
import bezbednost.repository.CertificateRepository;
import bezbednost.repository.RevokedCertificatesRepository;
import bezbednost.service.CertificateService;

import static bezbednost.keystores.KeyStore.*;

@Service
public class CertificateServiceImpl implements CertificateService {
	
	@Autowired
	private CertificateRepository certificateRepository;
	
	@Autowired
	private RevokedCertificatesRepository revokedCertificatesRepository;
	
	public void generateRoot(bezbednost.dto.Certificate selfSignedCertificateModel) throws Exception {
		
		KeyPair keyPair = generateKeyPair();
		
		SubjectData subjectData = generateSubjectData(selfSignedCertificateModel, keyPair, selfSignedCertificateModel.getValidity());
			
		IssuerData issuerData = generateIssuerData(keyPair.getPrivate(), selfSignedCertificateModel);
		X509Certificate cert = generateCertificate(subjectData, issuerData);
			
		KeyStore keyStore = KeyStore.getInstance("JKS", "SUN");
		
		String fileName = ROOT_FILE;
		String password = ROOT_PASS;
		String alias = selfSignedCertificateModel.getAlias();
		String pkPassword = alias;;
		BufferedInputStream in = new BufferedInputStream(new FileInputStream(fileName+".jks"));
		keyStore.load(in, password.toCharArray());
		keyStore.setCertificateEntry(alias, cert);
		keyStore.setKeyEntry(alias, keyPair.getPrivate(), pkPassword.toCharArray(), new Certificate[] {cert});
		keyStore.store(new FileOutputStream(fileName+".jks"), password.toCharArray());
		
		CertificateModel cModel = new CertificateModel();
		cModel.setSerialNum(cert.getSerialNumber().toString());
		cModel.setIssuerAlias(selfSignedCertificateModel.getAlias());
		//cModel.setSubject(cert.getSubjectDN().toString());
		cModel.setEmail(selfSignedCertificateModel.getEmail());
		cModel.setTypeOfCertificate(cert.getType());
		cModel.setAlgorithm(cert.getSigAlgName());
		cModel.setExpDate(cert.getNotAfter());
		cModel.setKsFileName(fileName);
		cModel.setAlias(selfSignedCertificateModel.getAlias());
		cModel.setPrivateKeyPassword(selfSignedCertificateModel.getAlias());
		cModel.setCA(true);
		certificateRepository.save(cModel);
	}
	
	public boolean generateOther(OtherCertificate otherCertificate) throws Exception {
		if(!certificateRepository.findByAlias(otherCertificate.getIssuerAlias()).isCA()) {
			return false;
		}
		KeyPair keyPair = generateKeyPair();
		
		SubjectData subjectData = generateSubjectData(otherCertificate, keyPair, otherCertificate.getValidity());
		
		CertificateModel  certificateModel = new CertificateModel();
		List<CertificateModel> lista = (List<CertificateModel>) certificateRepository.findAll();
		for(CertificateModel cm:lista) {
			if(cm.getAlias().equals(otherCertificate.getIssuerAlias()) && !isRevoked(cm.getSerialNum())) {
				certificateModel = cm;
			}
		}
		
		KeyStoreReader ksr = new KeyStoreReader();
		String issuerKsFile = certificateModel.getKsFileName();
		String issuerKsPass = getPassword(issuerKsFile);
		String issuerPassword = certificateRepository.findByAlias(otherCertificate.getIssuerAlias()).getPrivateKeyPassword();
		IssuerData issuerData = ksr.readIssuerFromStore(issuerKsFile+".jks", certificateModel.getAlias(), issuerKsPass.toCharArray(), issuerPassword.toCharArray());
		X509Certificate certIssuer = (X509Certificate)ksr.readCertificate(issuerKsFile + ".jks", issuerKsPass, otherCertificate.getIssuerAlias());

		Date today = new Date();
		if(today.after(certIssuer.getNotAfter())) {
			return false;
		}
		X509Certificate cert = generateCertificate(subjectData, issuerData);
		KeyStore keyStore = KeyStore.getInstance("JKS", "SUN");
		String fileName;
		if(otherCertificate.isCA())
			fileName = INTER_FILE;
		else
			fileName = END_FILE;
		
		String password = getPassword(fileName);
		
		String alias = otherCertificate.getAlias();
		String pkPassword = alias;
		
		BufferedInputStream in = new BufferedInputStream(new FileInputStream(fileName+".jks"));
		keyStore.load(in, password.toCharArray());
		keyStore.setCertificateEntry(alias, cert);
		keyStore.setKeyEntry(alias, keyPair.getPrivate(), pkPassword.toCharArray(), new Certificate[] {cert});
		keyStore.store(new FileOutputStream(fileName+".jks"), password.toCharArray());
		System.out.println(otherCertificate.isCA());
		CertificateModel cModel = new CertificateModel();
		cModel.setSerialNum(cert.getSerialNumber().toString());
		cModel.setIssuerAlias(otherCertificate.getIssuerAlias());
		cModel.setEmail(otherCertificate.getEmail());
		cModel.setTypeOfCertificate(cert.getType());
		cModel.setAlgorithm(cert.getSigAlgName());
		cModel.setExpDate(cert.getNotAfter());
		cModel.setKsFileName(fileName);
		cModel.setAlias(otherCertificate.getAlias());
		cModel.setPrivateKeyPassword(otherCertificate.getAlias());
		cModel.setCA(otherCertificate.isCA()); //ako je false onda je krajnji korisnik
		
		certificateRepository.save(cModel);

		return true;
	}
	
	public Boolean isVerified(String alias) {
		CertificateModel cm = certificateRepository.findByAlias(alias);
		String issuerAlias = cm.getIssuerAlias();
		KeyStoreReader ksr = new KeyStoreReader();
		String fileName = cm.getKsFileName();
		String password = getPassword(fileName);
		X509Certificate cert = (X509Certificate)ksr.readCertificate(fileName + ".jks", password, alias);
		if(alias == null || issuerAlias == null)
			return false;
		Date today = new Date();
		do {
			// 1. Da li je istekao ?
			if(today.after(cert.getNotAfter())) {
				return false;
			}
			CertificateModel cmI = certificateRepository.findByAlias(issuerAlias);
			String fileNameI = cmI.getKsFileName();
			String passwordI = getPassword(fileNameI);
			
			X509Certificate certI = (X509Certificate)ksr.readCertificate(fileNameI + ".jks", passwordI, issuerAlias);
			// 2. Provera potpisa
			try {
				cert.verify(certI.getPublicKey());
			} catch (Exception e) {
				return false;
			}
			// 3. Da li je povucen
			if(isRevoked(cm.getSerialNum()))
				return false;
			cm = cmI;
			cert = certI;
			alias = issuerAlias;
			issuerAlias = cm.getIssuerAlias();	
		} while(alias != issuerAlias);
		
		return true;
	}
	
	public CertificateModel getCertificate(String serialNum) {
		serialNum = serialNum.trim();
		return certificateRepository.findBySerialNum(serialNum);
	}
	
	public boolean revokeCertificate(String serialNum) {
		serialNum = serialNum.trim();
		RevokedCertificate rc = revokedCertificatesRepository.findBySerialNum(serialNum);
		if(rc != null)
			return true;
		rc = new RevokedCertificate();
		rc.setSerialNum(serialNum);
		revokedCertificatesRepository.save(rc);
		return true;
	}
	
	public boolean isRevoked(String serialNum) {
		serialNum = serialNum.trim();
		RevokedCertificate rc = revokedCertificatesRepository.findBySerialNum(serialNum);
		if(rc == null)
			return false;
		else
			return true;
	}
	
	public ArrayList<String> getAllSignatures() {
		Date today = new Date();
		ArrayList<String> listaPotpisnika = new ArrayList<>();
		List<CertificateModel> listaSvih = (List<CertificateModel>) certificateRepository.findAll();	
		for(CertificateModel cm:listaSvih) {	
			if(cm.isCA() && !isRevoked(cm.getSerialNum()) && !today.after(cm.getExpDate())) 
				listaPotpisnika.add(cm.getAlias());	
		}	
		return listaPotpisnika;
	}
	
	//sertifikaciona tela i sertifikati za krajnje korisnike
	private SubjectData generateSubjectData(bezbednost.dto.Certificate certificate, KeyPair keyPairSubject, int validity) {
		try {
			
			Date startDate = new Date();
			Date endDate = new Date(startDate.getTime() + validity * 365 * 24 * 60 * 60 * 1000L);
			
			//Serijski broj sertifikata
			String sn = certificate.getSerialNum();
			//klasa X500NameBuilder pravi X500Name objekat koji predstavlja podatke o vlasniku
			X500NameBuilder builder = new X500NameBuilder(BCStyle.INSTANCE);
		    builder.addRDN(BCStyle.CN, certificate.getCommonName());
		    builder.addRDN(BCStyle.O, certificate.getOrgName());
		    builder.addRDN(BCStyle.OU, certificate.getOrgUnit());
		    builder.addRDN(BCStyle.C, certificate.getCountry());
		    builder.addRDN(BCStyle.SERIALNUMBER, certificate.getSerialNum());
		    builder.addRDN(BCStyle.E, certificate.getEmail());
		    builder.addRDN(BCStyle.PSEUDONYM, certificate.getAlias());
		    
		    //Kreiraju se podaci za sertifikat, sto ukljucuje:
		    // - javni kljuc koji se vezuje za sertifikat
		    // - podatke o vlasniku
		    // - serijski broj sertifikata
		    // - od kada do kada vazi sertifikat
		    return new SubjectData(keyPairSubject.getPublic(), builder.build(), sn, startDate, endDate);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return null;
	}
	
	
	private IssuerData generateIssuerData(PrivateKey issuerKey, bezbednost.dto.Certificate selfSignedCertificateModel) {
		X500NameBuilder builder = new X500NameBuilder(BCStyle.INSTANCE);
		builder.addRDN(BCStyle.CN, selfSignedCertificateModel.getCommonName());
		builder.addRDN(BCStyle.O, selfSignedCertificateModel.getOrgName());
		builder.addRDN(BCStyle.OU, selfSignedCertificateModel.getOrgUnit());
		builder.addRDN(BCStyle.C, selfSignedCertificateModel.getCountry());
		builder.addRDN(BCStyle.SERIALNUMBER, selfSignedCertificateModel.getSerialNum());
		builder.addRDN(BCStyle.E, selfSignedCertificateModel.getEmail());
		builder.addRDN(BCStyle.PSEUDONYM, selfSignedCertificateModel.getAlias());
		    
		//Kreiraju se podaci za issuer-a, sto u ovom slucaju ukljucuje:
	    // - privatni kljuc koji ce se koristiti da potpise sertifikat koji se izdaje
	    // - podatke o vlasniku sertifikata koji izdaje nov sertifikat
		return new IssuerData(issuerKey, builder.build());
	}
	
	
	public X509Certificate generateCertificate(SubjectData subjectData, IssuerData issuerData) throws CertIOException {
		try {
			Security.addProvider(new BouncyCastleProvider());
			//Posto klasa za generisanje sertifiakta ne moze da primi direktno privatni kljuc pravi se builder za objekat
			//Ovaj objekat sadrzi privatni kljuc izdavaoca sertifikata i koristiti se za potpisivanje sertifikata
			//Parametar koji se prosledjuje je algoritam koji se koristi za potpisivanje sertifiakta
			JcaContentSignerBuilder builder = new JcaContentSignerBuilder("SHA256WithRSAEncryption");
			//Takodje se navodi koji provider se koristi, u ovom slucaju Bouncy Castle
			builder = builder.setProvider("BC");
			//Formira se objekat koji ce sadrzati privatni kljuc i koji ce se koristiti za potpisivanje sertifikata
			ContentSigner contentSigner = builder.build(issuerData.getPrivateKey());
			GeneralName location = new GeneralName(GeneralName.uniformResourceIdentifier, new DERIA5String("http://www.foo.org/ca.crt"));
			//Postavljaju se podaci za generisanje sertifiakta
			System.out.println(subjectData.getSerialNumber());
			X509v3CertificateBuilder certGen = new JcaX509v3CertificateBuilder(issuerData.getX500name(),
					new BigInteger(subjectData.getSerialNumber()),
					subjectData.getStartDate(),
					subjectData.getEndDate(),
					subjectData.getX500name(),
					subjectData.getPublicKey()).addExtension(new ASN1ObjectIdentifier("1.3.6.1.5.5.7.1.1"), false, new AuthorityInformationAccess(AccessDescription.id_ad_ocsp, location));
					//Generise se sertifikat
			X509CertificateHolder certHolder = certGen.build(contentSigner);
			//Builder generise sertifikat kao objekat klase X509CertificateHolder
			//Nakon toga je potrebno certHolder konvertovati u sertifikat, za sta se koristi certConverter
			JcaX509CertificateConverter certConverter = new JcaX509CertificateConverter();
			certConverter = certConverter.setProvider("BC");
			//Konvertuje objekat u sertifikat
			return certConverter.getCertificate(certHolder);
		} catch (CertificateEncodingException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (IllegalStateException e) {
			e.printStackTrace();
		} catch (OperatorCreationException e) {
			e.printStackTrace();
		} catch (CertificateException e) {
			e.printStackTrace();
		}
		
		return null;
	}
	
	
	private KeyPair generateKeyPair() {
        try {
			KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA"); 
			SecureRandom random = SecureRandom.getInstance("SHA1PRNG", "SUN");
			keyGen.initialize(2048, random);
			return keyGen.generateKeyPair();
        } catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		} catch (NoSuchProviderException e) {
			e.printStackTrace();
		}
	        
	    return null;
	}

	public List<CertificateModel> getAllCertificates() {
		List<CertificateModel> ret = new ArrayList<CertificateModel>();
		certificateRepository.findAll().iterator().forEachRemaining(ret::add);
		return ret;
	}

	@Override
	public List<CertificateModel> getAllCertificatesByEmail(String email) {
		return certificateRepository.findAllByEmail(email);
	}

}
