export class CertificateModel {
    public serialNum : string;
	public isCA : boolean;
	public alias : string;
	public ksFileName : string;
	public expDate : Date;	
	public issuerAlias : string;
	public email : string;
	public algorithm : string;
	public typeOfCertificate : string;

    constructor(serialNum: string, isCA: boolean, alias: string, ksFileName: string, expDate: Date,
		issuerAlias: string, email: string, algorithm: string, typeOfCertificate: string) {
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
}