import { startRegistration, startAuthentication } from "@simplewebauthn/browser";
import { getAuth, signInWithCustomToken } from "firebase/auth";

// URL de tus Firebase Functions (cambia por la tuya cuando hagas deploy)
const API_URL = "https://us-central1-TU-PROYECTO.cloudfunctions.net/api";

export async function registerWithBiometrics(email) {
  try {
    // Paso 1: pedir challenge al servidor
    const resp = await fetch(`${API_URL}/webauthn/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const options = await resp.json();

    // Paso 2: iniciar registro con huella/FaceID en el navegador
    const attResp = await startRegistration(options);

    // Paso 3: enviar respuesta al servidor
    const verificationResp = await fetch(`${API_URL}/webauthn/register/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, attResp }),
    });

    return await verificationResp.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function loginWithBiometrics(email) {
  try {
    // Paso 1: pedir challenge al servidor
    const resp = await fetch(`${API_URL}/webauthn/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const options = await resp.json();

    // Paso 2: autenticar con huella/FaceID
    const attResp = await startAuthentication(options);

    // Paso 3: enviar respuesta al servidor
    const verificationResp = await fetch(`${API_URL}/webauthn/login/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, attResp }),
    });
    const data = await verificationResp.json();

    // Paso 4: si está verificado, loguearse en Firebase
    if (data.verified && data.token) {
      const auth = getAuth();
      await signInWithCustomToken(auth, data.token);
    }

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
