package bezbednost.service;

import java.util.ArrayList;
import java.util.List;

import bezbednost.domain.CertificateModel;
import bezbednost.dto.Certificate;
import bezbednost.dto.OtherCertificate;

public interface CertificateService {
	void generateRoot(Certificate selfSignedCertificateModel) throws Exception;
	boolean generateOther(OtherCertificate otherCertificate) throws Exception;
	public CertificateModel getCertificate(String serialNum);
	public List<CertificateModel> getAllCertificates();
	boolean revokeCertificate(String serialNum);
	public boolean isRevoked(String serialNum);
	public Boolean isVerified(String alias);
	public ArrayList<String> getAllSignatures();
	public List<CertificateModel> getAllCertificatesByEmail(String email);
}
