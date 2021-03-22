package bezbednost.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "keyStore")
public class KeyStoreModel {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer ksId;

	@NotNull
	private String ksFileName;
	
	@NotNull
	private String ksPassword;
	
	
	public KeyStoreModel() {
		super();
	}
	
	public KeyStoreModel(String ksFileName, String ksPassword) {
		super();
		this.ksFileName = ksFileName;
		this.ksPassword = ksPassword;
	}

	public Integer getKsId() {
		return ksId;
	}

	public void setKsId(Integer ksId) {
		this.ksId = ksId;
	}

	public String getKsFileName() {
		return ksFileName;
	}

	public void setKsFileName(String ksFileName) {
		this.ksFileName = ksFileName;
	}

	public String getKsPassword() {
		return ksPassword;
	}

	public void setKsPassword(String ksPassword) {
		this.ksPassword = ksPassword;
	}

}
