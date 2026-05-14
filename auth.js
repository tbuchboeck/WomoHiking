// auth.js — WomoHiking variant. Gates the app behind WebAuthn passkey auth
// served by auth.apps.buchboeck.at (the shared auth-buchboeck project).
//
// Public-data variant (no PIN UI). New-device bootstrap flows through
// the recovery-code path. Adapted verbatim from LakeTemp's auth.js with
// APP_ID='womohiking' and SESSION_KEY='womohiking.auth.session.v1'.

(() => {
  'use strict';

  const APP_ID = 'womohiking';
  const AUTH_API = 'https://auth.apps.buchboeck.at/api/auth';
  const SESSION_KEY = 'womohiking.auth.session.v1';

  const overlay = document.getElementById('auth-overlay');
  const errorEl = document.getElementById('auth-error');
  const spinnerEl = document.getElementById('auth-spinner');
  const biometricBtn = document.getElementById('auth-biometric');
  const recoveryBtn = document.getElementById('auth-recovery-btn');

  function decodeJwtPayload(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
      return JSON.parse(atob(padded));
    } catch {
      return null;
    }
  }
  function loadSession() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const payload = decodeJwtPayload(raw);
    if (!payload || !payload.exp) return null;
    if (Date.now() / 1000 >= payload.exp - 5) return null;
    return { jwt: raw, payload };
  }
  function saveSession(jwt) { sessionStorage.setItem(SESSION_KEY, jwt); }

  function b64urlToBuffer(b64url) {
    const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    const bin = atob(padded);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr.buffer;
  }
  function bufferToB64url(buf) {
    const bin = String.fromCharCode(...new Uint8Array(buf));
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function decodeCreationOptions(opts) {
    return {
      ...opts,
      challenge: b64urlToBuffer(opts.challenge),
      user: { ...opts.user, id: b64urlToBuffer(opts.user.id) },
      excludeCredentials: (opts.excludeCredentials || []).map(c => ({
        ...c, id: b64urlToBuffer(c.id),
      })),
    };
  }
  function decodeRequestOptions(opts) {
    return {
      ...opts,
      challenge: b64urlToBuffer(opts.challenge),
      allowCredentials: (opts.allowCredentials || []).map(c => ({
        ...c, id: b64urlToBuffer(c.id),
      })),
    };
  }
  function encodeAttestationResponse(cred) {
    return {
      id: cred.id,
      rawId: bufferToB64url(cred.rawId),
      type: cred.type,
      response: {
        attestationObject: bufferToB64url(cred.response.attestationObject),
        clientDataJSON:    bufferToB64url(cred.response.clientDataJSON),
        transports: cred.response.getTransports ? cred.response.getTransports() : undefined,
      },
      clientExtensionResults: cred.getClientExtensionResults?.() ?? {},
    };
  }
  function encodeAssertionResponse(cred) {
    return {
      id: cred.id,
      rawId: bufferToB64url(cred.rawId),
      type: cred.type,
      response: {
        authenticatorData: bufferToB64url(cred.response.authenticatorData),
        clientDataJSON:    bufferToB64url(cred.response.clientDataJSON),
        signature:         bufferToB64url(cred.response.signature),
        userHandle: cred.response.userHandle ? bufferToB64url(cred.response.userHandle) : null,
      },
      clientExtensionResults: cred.getClientExtensionResults?.() ?? {},
    };
  }

  async function api(path, body) {
    let r;
    try {
      r = await fetch(`${AUTH_API}/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (netErr) {
      const err = new Error(`network/CORS: ${netErr.message}`);
      err.kind = 'network';
      throw err;
    }
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      const err = new Error(data.error || `HTTP ${r.status}`);
      err.status = r.status;
      err.kind = 'http';
      throw err;
    }
    return data;
  }

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.add('visible');
    setTimeout(() => errorEl.classList.remove('visible'), 4000);
  }
  function setBusy(busy) {
    spinnerEl.classList.toggle('visible', busy);
    [biometricBtn, recoveryBtn].forEach(b => { if (b) b.disabled = busy; });
  }
  function showOverlay() {
    overlay.classList.remove('hidden');
    document.body.classList.add('auth-locked');
  }
  function hideOverlay() {
    overlay.classList.add('hidden');
    document.body.classList.remove('auth-locked');
    window.dispatchEvent(new CustomEvent('auth:unlocked'));
  }

  async function enrollPasskey(bootstrap_token) {
    setBusy(true);
    try {
      const optsResp = await api('register?step=options', { bootstrap_token, app_id: APP_ID });
      const cred = await navigator.credentials.create({
        publicKey: decodeCreationOptions(optsResp.options),
      });
      const verifyResp = await api('register?step=verify', {
        session_id: optsResp.session_id,
        app_id: APP_ID,
        bootstrap_token,
        attestation: encodeAttestationResponse(cred),
        device_label: detectDeviceLabel(),
      });
      saveSession(verifyResp.session);
      hideOverlay();
    } catch (err) {
      showError(`Enrollment fehlgeschlagen: ${err.message}`);
      throw err;
    } finally {
      setBusy(false);
    }
  }

  async function loginWithPasskey() {
    setBusy(true);
    try {
      const optsResp = await api('login?step=options', { app_id: APP_ID });
      const cred = await navigator.credentials.get({
        publicKey: decodeRequestOptions(optsResp.options),
      });
      const verifyResp = await api('login?step=verify', {
        session_id: optsResp.session_id,
        app_id: APP_ID,
        assertion: encodeAssertionResponse(cred),
      });
      saveSession(verifyResp.session);
      hideOverlay();
    } catch (err) {
      console.error('[auth] loginWithPasskey error', err);
      if (err.name === 'NotAllowedError') {
        showError('Abgebrochen oder kein Passkey verfügbar.');
      } else if (err.kind === 'network') {
        showError(`Netzwerk-/CORS-Fehler: ${err.message}`);
      } else if (err.status === 404) {
        showError('Noch kein Passkey für dieses Gerät. Recovery-Code verwenden.');
      } else if (err.status === 401) {
        showError(`Login abgelehnt: ${err.message}`);
      } else {
        showError(`Login fehlgeschlagen (${err.status || '?'}): ${err.message}`);
      }
    } finally {
      setBusy(false);
    }
  }

  async function consumeRecoveryCode() {
    const code = prompt('Recovery-Code eingeben (5 Gruppen à 5 Zeichen):');
    if (!code) return;
    setBusy(true);
    try {
      const { bootstrap_token } = await api('recovery-code?action=consume', { code, app_id: APP_ID });
      await enrollPasskey(bootstrap_token);
    } catch (err) {
      showError(`Recovery fehlgeschlagen: ${err.message}`);
    } finally {
      setBusy(false);
    }
  }

  function detectDeviceLabel() {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
    if (/Android/.test(ua)) return 'Android';
    if (/Macintosh/.test(ua)) return 'macOS';
    if (/Windows/.test(ua)) return 'Windows';
    if (/Linux/.test(ua)) return 'Linux';
    return 'Browser';
  }

  function init() {
    if (!overlay) return;
    if (loadSession()) {
      hideOverlay();
      return;
    }
    showOverlay();
    if (!window.PublicKeyCredential) {
      biometricBtn.style.display = 'none';
    }
    biometricBtn?.addEventListener('click', loginWithPasskey);
    recoveryBtn?.addEventListener('click', consumeRecoveryCode);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
