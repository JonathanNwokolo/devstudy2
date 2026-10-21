/**
 * Acesso ao localStorage tolerante a falhas (modo privado, cota, valor corrompido).
 * Chaves em uso: "theme", "devstudy_bookmarks", "devstudy-progress".
 */

export function readString(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
}

export function writeString(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  return writeString(key, JSON.stringify(value));
}
