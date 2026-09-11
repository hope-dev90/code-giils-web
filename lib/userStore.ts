const KEY = "codehills_users";

function load(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function save(users: Record<string, string>) {
  localStorage.setItem(KEY, JSON.stringify(users));
}

export function userExists(username: string): boolean {
  return username.toLowerCase() in load();
}

export function signUp(username: string, password: string): void {
  const users = load();
  users[username.toLowerCase()] = password;
  save(users);
}

export function login(username: string, password: string): boolean {
  const users = load();
  return users[username.toLowerCase()] === password;
}
