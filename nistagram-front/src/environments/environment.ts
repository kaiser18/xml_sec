// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrlUser: 'http://localhost:23002',
 // baseUrlAuth: 'http://localhost:23001',
  editUser: 'edit',
  getUser: 'user',
//  createUser: 'register',
//  authenticate: 'login', 

  baseUrl: 'https://localhost:8443',
  certificate: 'api/certificate',
  createRootCertificate: 'generateRoot',
  createOtherCertificate: 'generateOther',
  getAllCertificates: 'getAllCertificates',
  getAllCertificatesByEmail: 'getAllCertificatesByEmail',
  revokeCertificate: 'revokeCertificate',
  isRevoked: 'isRevoked',
  isDesired: 'isVerified',
  auth: 'auth',
  login: 'login',
  createUser: 'signup',
  forgotPassword: 'resetPassword',
  resetPassword: 'changePassword',
  verify: 'verify'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
