package bezbednost.dto;

import javax.validation.constraints.Email;

public class Certificate {
	private String alias;
	private String privateKeyPassword;
	private String commonName;
	private String orgName;
	private String orgUnit;
	private String country;
	@Email(message="Email is not in the correct format.")
	private String email;
	private String serialNum;
	public int validity;
	public String purpose;
	
	
	public Certificate() {
		
	}

	public Certificate(String commonName,String alias, String orgName, String orgUnit, String country, String email,
		    String serialNum, String privateKeyPassword, int validity, String purpose) {
		super();
		this.commonName = commonName;
		this.alias = alias;
		this.orgName = orgName;
		this.orgUnit = orgUnit;
		this.country = country;
		this.email = email;
		this.serialNum = serialNum;
		this.privateKeyPassword = privateKeyPassword;
		this.validity = validity;
		this.purpose = purpose;
	}

	public String getCommonName() {
		return commonName;
	}

	public void setCommonName(String commonName) {
		this.commonName = commonName;
	}

	public String getOrgName() {
		return orgName;
	}

	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}

	public String getOrgUnit() {
		return orgUnit;
	}

	public void setOrgUnit(String orgUnit) {
		this.orgUnit = orgUnit;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getSerialNum() {
		return serialNum;
	}

	public void setSerialNum(String serialNum) {
		this.serialNum = serialNum;
	}

	public String getPurpose() {
		return purpose;
	}

	public void setPurpose(String purpose) {
		this.purpose = purpose;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public String getPrivateKeyPassword() {
		return privateKeyPassword;
	}

	public void setPrivateKeyPassword(String privateKeyPassword) {
		this.privateKeyPassword = privateKeyPassword;
	}

	public int getValidity() {
		return validity;
	}

	public void setValidity(int validity) {
		this.validity = validity;
	}
	
}
