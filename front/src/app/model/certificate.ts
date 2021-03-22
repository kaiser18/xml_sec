export class Certificate {
    public commonName : string;
    public alias : string;
    public orgName: string;
    public orgUnit: string;
    public country: string;
    public email: string;
    public serialNum: string;
    public ksName: string;
    public ksPassword: string;
    public privateKeyPassword: string;
    public validity: string;
    public purpose: string;

    constructor(commonName: string, alias: string, orgName: string,
        orgUnit: string, country: string, email: string,
        serialNum: string, ksName: string, ksPasword: string,
        privateKeyPassword: string, validity: string, purpose: string) {
            this.commonName = commonName;
            this.alias = alias;
            this.orgName = orgName;
            this.orgUnit = orgUnit;
            this.country = country;
            this.email = email;
            this.serialNum = serialNum;
            this.ksName = ksName;
            this.ksPassword = ksPasword;
            this.privateKeyPassword = privateKeyPassword;
            this.validity = validity;
            this.purpose = purpose;
        }
}