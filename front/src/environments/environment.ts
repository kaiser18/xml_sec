// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://localhost:8081',
  createRootCertificate: 'api/certificate/generateRoot',
  createOtherCertificate: 'api/certificate/generateOther',
  getAllCertificates: 'api/certificate/getAllCertificates',
  getAllCertificatesByEmail: 'api/certificate/getAllCertificatesByEmail',
  revokeCertificate: 'api/certificate/revokeCertificate',
  isRevoked: 'api/certificate/isRevoked',
  isDesired: 'api/certificate/isVerified',
  apiUrl: 'http://localhost:8081/auth/login'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
