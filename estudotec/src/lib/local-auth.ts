import { secureGetItem, secureSetItem } from "@/lib/storage-crypto";

export type UserRole = "admin" | "usuario";

export type LocalUser = {
  name?: string;
  email: string;
  senha: string;
  role: UserRole;
  createdAt: string;
};

const USERS_KEY = "estudotec-usuarios";

export function readUsers(seedUsers: LocalUser[]): LocalUser[] {
  try {
    const stored = secureGetItem(USERS_KEY);
    if (!stored) {
      return seedUsers;
    }
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as LocalUser[]) : seedUsers;
  } catch {
    return seedUsers;
  }
}

export function saveUsers(users: LocalUser[]) {
  try {
    secureSetItem(USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error("Erro ao salvar usuários:", err);
  }
}

export function getAllLocalUsers(seedUsers: LocalUser[]): LocalUser[] {
  return readUsers(seedUsers);
}

export function hasLocalUser(email: string, seedUsers: LocalUser[]) {
  return Boolean(findLocalUser(email, seedUsers));
}

export function findLocalUser(email: string, seedUsers: LocalUser[]) {
  return readUsers(seedUsers).find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
}

export function registerLocalUser(
  email: string,
  senha: string,
  seedUsers: LocalUser[],
  role: UserRole = "usuario"
) {
  const users = readUsers(seedUsers);
  if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
    return false;
  }
  const newUser: LocalUser = {
    name: email.split("@")[0].replace(/[._-]+/g, " "),
    email,
    senha,
    role,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  return true;
}

export function updateLocalUser(
  email: string,
  updatedData: Partial<Omit<LocalUser, "email">>,
  seedUsers: LocalUser[]
): boolean {
  const users = readUsers(seedUsers);
  const index = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (index === -1) return false;

  users[index] = {
    ...users[index],
    ...updatedData,
  };
  saveUsers(users);
  return true;
}

export function deleteLocalUser(email: string, seedUsers: LocalUser[]): boolean {
  const users = readUsers(seedUsers);
  const filtered = users.filter((u) => u.email.toLowerCase() !== email.toLowerCase());
  if (filtered.length === users.length) return false;
  saveUsers(filtered);
  return true;
}

export function verifyLocalUser(
  email: string,
  senha: string,
  seedUsers: LocalUser[]
): LocalUser | null {
  const user = findLocalUser(email, seedUsers);
  if (user && user.senha === senha) {
    return user;
  }
  return null;
}
