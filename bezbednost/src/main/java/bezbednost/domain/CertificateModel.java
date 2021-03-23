package bezbednost.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.sun.istack.NotNull;

@Entity
@Table(name="CertificateModel")
public class CertificateModel {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;

	@NotNull
	private String serialNum;

	@NotNull
	private boolean isCA;

	@Column(unique = true)
	@NotNull
	private String alias;

	@NotNull
	private String ksFileName;
	
	private Date expDate;	
	private String issuerAlias;
	private String email;
	private String algorithm;
	private String typeOfCertificate;
	
	
	public CertificateModel() {
		
	}

	public CertificateModel(String serialNum, boolean isCA, String alias, String ksFileName, Date expDate,
			String issuerAlias, String email, String algorithm, String typeOfCertificate) {
		super();
		this.serialNum = serialNum;
		this.isCA = isCA;
		this.alias = alias;
		this.ksFileName = ksFileName;
		this.expDate = expDate;
		this.issuerAlias = issuerAlias;
		this.email = email;
		this.algorithm = algorithm;
		this.typeOfCertificate = typeOfCertificate;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getSerialNum() {
		return serialNum;
	}

	public void setSerialNum(String serialNum) {
		this.serialNum = serialNum;
	}

	public boolean isCA() {
		return isCA;
	}

	public void setCA(boolean isCA) {
		this.isCA = isCA;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public String getKsFileName() {
		return ksFileName;
	}

	public void setKsFileName(String ksFileName) {
		this.ksFileName = ksFileName;
	}

	public Date getExpDate() {
		return expDate;
	}

	public void setExpDate(Date expDate) {
		this.expDate = expDate;
	}

	public String getIssuerAlias() {
		return issuerAlias;
	}

	public void setIssuerAlias(String issuerAlias) {
		this.issuerAlias = issuerAlias;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getAlgorithm() {
		return algorithm;
	}

	public void setAlgorithm(String algorithm) {
		this.algorithm = algorithm;
	}

	public String getTypeOfCertificate() {
		return typeOfCertificate;
	}

	public void setTypeOfCertificate(String typeOfCertificate) {
		this.typeOfCertificate = typeOfCertificate;
	}
}
