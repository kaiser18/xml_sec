package bezbednost.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name="RevokedCertificates")
public class RevokedCertificate {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer Id;

	@NotNull
	private String serialNum;	

	public RevokedCertificate() {
		super();
	}

	public Integer getId() {
		return Id;
	}

	public String getSerialNum() {
		return serialNum;
	}

	public void setId(Integer id) {
		Id = id;
	}

	public void setSerialNum(String serialNum) {
		this.serialNum = serialNum;
	}
	
}
