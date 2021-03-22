package bezbednost.dto;


public class OtherCertificate extends Certificate {
	
	private String issuerAlias;
	private String issuerPassword;
	private boolean isCA;
	
	
	public OtherCertificate() {
		
	}

	public OtherCertificate(String ksName, String ksPassword, String privateKeyPassword, String issuerAlias, String issuerPassword, String commonName,
			String alias, String orgName, String orgUnit, String country, String email, String serialNum,
			String validity, String purpose, boolean isCA) {
		super(commonName, alias, orgName, orgUnit, country, email,
			    serialNum, ksName, ksPassword, privateKeyPassword, validity, purpose);
		this.issuerAlias = issuerAlias;
		this.issuerPassword = issuerPassword;
		this.isCA = isCA;
	}

	public String getIssuerAlias() {
		return issuerAlias;
	}

	public String getIssuerPassword() {
		return issuerPassword;
	}

	public boolean isCA() {
		return isCA;
	}

	public void setIssuerAlias(String issuerAlias) {
		this.issuerAlias = issuerAlias;
	}

	public void setIssuerPassword(String issuerPassword) {
		this.issuerPassword = issuerPassword;
	}

	public void setIsCA(boolean isCA) {
		this.isCA = isCA;
	}	
	
}
