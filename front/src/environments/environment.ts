// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'https://localhost:8443',
  createRootCertificate: 'api/certificate/generateRoot',
  createOtherCertificate: 'api/certificate/generateOther',
  getAllCertificates: 'api/certificate/getAllCertificates',
  getAllCertificatesByEmail: 'api/certificate/getAllCertificatesByEmail',
  revokeCertificate: 'api/certificate/revokeCertificate',
  isRevoked: 'api/certificate/isRevoked',
  isDesired: 'api/certificate/isVerified',
  registerUser: 'register',
  apiUrl: 'https://localhost:8443/auth/login',
  createUser: 'auth/signup',
  forgotPassword: 'auth/resetPassword',
  resetPassword: 'auth/changePassword',
  verify: 'auth/verify'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
