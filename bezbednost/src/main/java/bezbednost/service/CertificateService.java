package bezbednost.service;

import java.util.ArrayList;

import bezbednost.domain.CertificateModel;
import bezbednost.dto.OtherCertificate;
import bezbednost.dto.SelfSignedCertificateModel;

public interface CertificateService {
	void generateRoot(SelfSignedCertificateModel selfSignedCertificateModel) throws Exception;
	boolean generateOther(OtherCertificate otherCertificate) throws Exception;
	public CertificateModel getCertificate(String serialNum);
	boolean revokeCertificate(String serialNum);
	public boolean isRevoked(String serialNum);
	public ArrayList<String> getAllSignatures();
}
