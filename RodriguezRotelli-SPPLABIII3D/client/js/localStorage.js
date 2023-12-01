export function LeerData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

export function GuardarData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

