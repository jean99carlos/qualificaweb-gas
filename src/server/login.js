/*const firebaseConfig = {
  apiKey: "AIzaSyBVBBsrVw7LfqpCj4NP2KlGRXqSQFmsOsU",
  authDomain: "qualifica-web-383414.firebaseapp.com",
  projectId: "qualifica-web-383414",
  storageBucket: "qualifica-web-383414.appspot.com",
  messagingSenderId: "339146918569",
  appId: "1:339146918569:web:d09898d85dbe71f15477b8",
  measurementId: "G-KXFK8ZW3CW",
};
let firestoreConfig = {
  "type": "service_account",
  "project_id": "qualifica-web-383414",
  "private_key_id": "a0dbfbc63426816461ac6a722679145df166df5a",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDaGMWTeS9dKET+\n+I2W/nCSL5TJIen4Gaezdbe8+1TXHU14wLPVHKXJLb5ixL3LAG9Op1YR8Bm4xJDt\nJ4HdgTPyFzEiTwYmxTOB9/H9AJLqkGh7++mehbwT0tj/uTZJSCin+L8u8VVykD90\nsJ+q3kQJvqbT12riOJ5pGt+KswGIUshb0WjFZ3603p8vaF1bavu1RvFFFTLeW4ae\n4WRltTJ5qOmPuEi91Ub7iJP/WKibdUTV4FgWVnvHGwND7RmzAPxFjuCbvbMmRmWb\nhSl4+OG+YMPsr52Oq1MGTYPiY9RsoKMT0vpyJxjwtX4RibjIpQ+FrkYVNeQQhPFZ\n7DXKS1RNAgMBAAECggEADLDBJbQOZ5EytekLE288ks5eIzehYwcad79gtghO1xHf\nV+h986eDgGRfGLqsy4LmjHusBFuwTMzH8mYTMQB2Cr8YOWWX7J9wFZQymmo94j8N\ntrHWwHC03AIaZS48WdZvIoT/b5EUi9fCZX0V3ANWZKsZZH1l/KysOl6ZWtCl2m4m\nhvy9C+Oe2g0FXAapQd/c9lPJ38lbBZzu/CRHjUyW0D+wLv3a59jwUSTxlEOzf+x2\nO5pOh+MLZawAzovVyZMhEC/N6SBITcuFlqoSBrci4IRbzqSb20/AJ590xh8QNi1i\nfzoVzoREXs1p3m4miQV0A5YOgYeWkVfd3ybMaoEwQQKBgQD1qHjLDGbNwBI47tI1\nHcVjNKNXt/mk4Nw6shRXhtRM4u4/+8PS6SYr7/b9LFm2ylQepyiV8rb6jae+D1GQ\nW2iVz58kOJN9GiXEec2yCuevPQzAQEv0zHNiz/Yc9j/S5OhIR0DwuspLHVfF2P9f\n7lMTLnAHQdBCHwmgdW70mPKBDQKBgQDjR0N3qtlhfTfN80tndZwNOFPKF+XHSfrM\n87ym0H3hs1DZ4MufkT0T2GnzKSEHlNv4joi2cI/Q7a1DGUaK4vuEHf32EbAe3uMS\neHe9jUiXXYxQ2h30V8CJROg2HkgtuzE3+ndOY/PP/0X6J4V0U3Q8tLrlinJi+RmU\no1lld9bQQQKBgQDHeG/09/H1+ZMSVaGsbascfd5wWLvGDKvmoTjxRVLXx6CLpcQB\nWz2aibQ1KTEDwtCBP1wuPbIkSqe9JTUmkYKfusHPKH1iJLwsCHdkrYQo/9p9tPe4\nI9dBkfmW1MFIXoTaQ7lQf2vJiF8AEM50N9GPDrL6wY74UbmAaDqbNCIddQKBgHmp\nijoi4N7I8vhyRmkJkhGZl3DVPhFiTrkruE7ryJbrMFqRdS7jxng7HuwlliLC0sXJ\nNvHCa5oBwP/sJdDvFIhyraHtcgP0eEVI64AygytTzmrxd5t25gAVPODLcQPZ8szu\nbLMv2jH7inAQe+X7Tnu4m1uIsxa8Fa91icNBVWKBAoGACgflQIVOVVPj1rEedHLH\n88bu3f6MvtdDxdeIY8y6EOwNLwRvHIMvycUaYw0P3m3U5Q8z4Ik1Aunqsm0TaIDW\nRWsfsaZPdCc5nkeXP6i+f/6v4/0RUu9aYjP2hhfs3snPDq9utR12Kl4PpSaiC5bq\nLx02M3QoQ2j4ns9S5YEkHk4=\n-----END PRIVATE KEY-----\n",
  "client_email": "firestore@qualifica-web-383414.iam.gserviceaccount.com",
  "client_id": "113962947588477688686",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firestore%40qualifica-web-383414.iam.gserviceaccount.com"
};


function login() {
  FirebaseApp.signInWithIdp(firebaseConfig, ScriptApp.getIdentityToken());
  try {
    const url = "https://qualifica-web-383414-default-rtdb.firebaseio.com/";
    FirebaseApp.getDatabaseByUrl(url);
  } catch { }
  const firestore = FirestoreApp.getFirestore(
    firestoreConfig.client_email,
    firestoreConfig.private_key,
    firestoreConfig.project_id
  );
  const allDocuments = firestore.getDocuments("grupoUsuario")

  console.log(JSON.stringify(allDocuments));
}
*/