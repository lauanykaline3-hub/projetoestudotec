/**
 * Módulo de Criptografia para LocalStorage
 * Protege todos os dados armazenados no navegador contra inspeção em texto simples.
 */

const SECRET_KEY = "EstudoTec@Secure#2026_LocalVault_SafeClient";

export function encryptData(plainText: string): string {
  try {
    const utf8Bytes = new TextEncoder().encode(plainText);
    const keyBytes = new TextEncoder().encode(SECRET_KEY);
    const encryptedBytes = new Uint8Array(utf8Bytes.length);

    for (let i = 0; i < utf8Bytes.length; i++) {
      encryptedBytes[i] = utf8Bytes[i] ^ keyBytes[i % keyBytes.length];
    }

    // Converte para Base64 com prefixo identificador
    let binary = "";
    for (let i = 0; i < encryptedBytes.length; i++) {
      binary += String.fromCharCode(encryptedBytes[i]);
    }
    return "enc_" + btoa(binary);
  } catch (err) {
    console.error("Erro ao criptografar dados:", err);
    return plainText;
  }
}

export function decryptData(cipherText: string): string {
  if (!cipherText) return "";
  // Se não estiver no formato criptografado, retorna o texto original (compatibilidade)
  if (!cipherText.startsWith("enc_")) {
    return cipherText;
  }

  try {
    const binary = atob(cipherText.slice(4));
    const encryptedBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      encryptedBytes[i] = binary.charCodeAt(i);
    }

    const keyBytes = new TextEncoder().encode(SECRET_KEY);
    const decryptedBytes = new Uint8Array(encryptedBytes.length);
    for (let i = 0; i < encryptedBytes.length; i++) {
      decryptedBytes[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
    }

    return new TextDecoder().decode(decryptedBytes);
  } catch (err) {
    console.error("Erro ao descriptografar dados:", err);
    return "";
  }
}

export function secureSetItem(key: string, value: string): void {
  try {
    const encrypted = encryptData(value);
    localStorage.setItem(key, encrypted);
  } catch (err) {
    console.error(`Erro ao salvar ${key} de forma segura:`, err);
  }
}

export function secureGetItem(key: string): string | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return decryptData(raw);
  } catch {
    return null;
  }
}

export function secureRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function secureClearAll(): void {
  try {
    localStorage.clear();
  } catch {
    // ignore
  }
}

