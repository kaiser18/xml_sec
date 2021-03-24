package bezbednost.dto;

public class SelfSignedCertificateModel extends Certificate {
	public String aia;
	public String cdp;
	
	public SelfSignedCertificateModel() {
		
	}

	public SelfSignedCertificateModel(String commonName,String alias, String orgName, String orgUnit, String country, String email,
		    String serialNum, String ksName, String privateKeyPassword, String validity,
			String aia, String cdp, String purpose) {
		super(commonName, alias, orgName, orgUnit, country, email,
			    serialNum, ksName, privateKeyPassword, validity, purpose);
		this.aia = aia;
		this.cdp = cdp;
		
	}

	public String getAia() {
		return aia;
	}

	public String getCdp() {
		return cdp;
	}

	public void setAia(String aia) {
		this.aia = aia;
	}

	public void setCdp(String cdp) {
		this.cdp = cdp;
	}

}
