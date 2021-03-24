export class OtherCertificate {
    public issuerAlias: string;
    public commonName : string;
    public alias : string;
    public orgName: string;
    public orgUnit: string;
    public country: string;
    public email: string;
    public serialNum: string;
    public validity: number;
    public purpose: string;
    public isCA: boolean;

    constructor(issuerAlias: string, commonName: string, alias: string, orgName: string, orgUnit: string,
        country: string, email: string, serialNum: string, validity: number, purpose: string, isCA: boolean) {
            this.issuerAlias = issuerAlias;
            this.commonName = commonName;
            this.alias = alias;
            this.orgName = orgName;
            this.orgUnit = orgUnit;
            this.country = country;
            this.email = email;
            this.serialNum = serialNum;
            this.validity = validity;
            this.purpose = purpose;
            this.isCA = isCA;
    }
}