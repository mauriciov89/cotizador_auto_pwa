// auth.js
document.addEventListener('DOMContentLoaded', () => {
  if (!firebase.apps.length) {
    console.error("Firebase no está inicializado");
    return;
  }
  const auth = firebase.auth();
  // ... resto de tu código
});
// Función para registrar usuario
function registrar(email, password) {
  return auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      // Redirigir al cotizador
      window.location.href = 'index.html'; 
    });
}

// Función para iniciar sesión
function login(email, password) {
  return auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = 'index.html';
    });
}

// Escuchar cambios de autenticación
auth.onAuthStateChanged(user => {
  if (!user && !window.location.pathname.includes('login.html')) {
    // Si no está autenticado, redirigir a login
    window.location.href = 'login.html';
  }
});
// Verificar si el navegador soporta huella
function soportaHuella() {
  return window.PublicKeyCredential && 
         PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable;
}

// Registrar huella
function registrarHuella() {
  if (soportaHuella()) {
    const user = auth.currentUser;
    // Lógica de Firebase para WebAuthn
  }
}
// En auth.js - Función para detectar y usar huella
async function loginConHuella() {
  try {
    const { user } = await auth.signInWithEmailAndPassword('usuario@ejemplo.com', 'temp123');
    const credential = await user.multiFactor.getSession();
    
    // Configuración específica para WebAuthn
    const authConfig = {
      factorId: auth.FactorId.PHONE,
      displayName: 'Huella Digital'
    };
    
    await user.multiFactor.enroll(authConfig);
    alert('Huella registrada!');
  } catch (error) {
    console.error("Error huella:", error);
  }
}

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth(initializeApp(firebaseConfig));

// Bloquear acceso sin autenticación
onAuthStateChanged(auth, (user) => {
  const isLoginPage = window.location.pathname.includes('login.html');
  
  if (!user && !isLoginPage) {
    window.location.href = 'login.html';
  }
  
  if (user && isLoginPage) {
    window.location.href = 'index.html'; // Redirige si ya está autenticado
  }
});

// Login con email/contraseña
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target[0].value;
  const password = e.target[1].value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // Redirige al index.html tras login exitoso
    window.location.href = 'index.html'; 
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

// Verifica compatibilidad con huella
function isBiometricSupported() {
  return window.PublicKeyCredential && 
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable?.();
}

// Botón para huella (en login.html)
document.getElementById('btnHuella')?.addEventListener('click', async () => {
  if (!isBiometricSupported()) {
    alert('Tu dispositivo no soporta huella digital');
    return;
  }

  try {
    const credential = await navigator.credentials.get({
      publicKey: {
        challenge: new Uint8Array(32),
        rp: { id: "cotizador-auto-pwa.firebaseapp.com" },
        userVerification: 'required'
      }
    });
    // Lógica para autenticar con Firebase
    console.log('Huella verificada:', credential);
  } catch (error) {
    console.error('Error en huella:', error);
  }
});