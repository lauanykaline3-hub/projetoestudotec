export type LocalUser = {
  name?: string;
  email: string;
  salt: string;
  passwordHash: string;
  createdAt: string;
};

const USERS_KEY = "estudotec-usuarios";
const PBKDF2_ITERATIONS = 310_000;
const HASH_LENGTH_BITS = 256;

function hex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function fromHex(value: string) {
  return new Uint8Array(value.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) ?? []);
}

function equalHash(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

async function derivePasswordHash(password: string, salt: Uint8Array) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const saltBuffer = new ArrayBuffer(salt.byteLength);
  new Uint8Array(saltBuffer).set(salt);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: saltBuffer, iterations: PBKDF2_ITERATIONS },
    key,
    HASH_LENGTH_BITS,
  );
  return hex(new Uint8Array(bits));
}

function readUsers(seedUsers: LocalUser[]): LocalUser[] {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) return seedUsers;
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed as LocalUser[] : seedUsers;
  } catch {
    return seedUsers;
  }
}

export function hasLocalUser(email: string, seedUsers: LocalUser[]) {
  return Boolean(findLocalUser(email, seedUsers));
}

export function findLocalUser(email: string, seedUsers: LocalUser[]) {
  return readUsers(seedUsers).find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export async function registerLocalUser(email: string, password: string, seedUsers: LocalUser[]) {
  const users = readUsers(seedUsers);
  if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) return false;
  const salt = crypto.getRandomValues(new Uint8Array(16));
  users.push({
    name: email.split("@")[0].replace(/[._-]+/g, " "),
    email,
    salt: hex(salt),
    passwordHash: await derivePasswordHash(password, salt),
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return true;
}

export async function verifyLocalUser(email: string, password: string, seedUsers: LocalUser[]) {
  const user = findLocalUser(email, seedUsers);
  const salt = user ? fromHex(user.salt) : new Uint8Array(16);
  const candidate = await derivePasswordHash(password, salt);
  return user && equalHash(candidate, user.passwordHash) ? user : null;
}

