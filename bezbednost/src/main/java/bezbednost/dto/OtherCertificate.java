package bezbednost.dto;


public class OtherCertificate extends Certificate {
	
	private String issuerAlias;
	private boolean isCA;
	
	
	public OtherCertificate() {
		
	}

	public OtherCertificate(String ksName, String privateKeyPassword, String issuerAlias, String commonName,
			String alias, String orgName, String orgUnit, String country, String email, String serialNum,
			String validity, String purpose, boolean isCA) {
		super(commonName, alias, orgName, orgUnit, country, email,
			    serialNum, ksName, privateKeyPassword, validity, purpose);
		this.issuerAlias = issuerAlias;
		this.isCA = isCA;
	}

	public String getIssuerAlias() {
		return issuerAlias;
	}

	public boolean isCA() {
		return isCA;
	}

	public void setIssuerAlias(String issuerAlias) {
		this.issuerAlias = issuerAlias;
	}

	public void setIsCA(boolean isCA) {
		this.isCA = isCA;
	}	
	
}
