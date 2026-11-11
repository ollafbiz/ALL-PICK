export function formatRelativeTime(date) {
  return `${String(date.getFullYear()).slice(2)}.${String(date.getMonth()+1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}
export function formatAbsoluteDate(date) {
  return `${date.getFullYear()}.${String(date.getMonth()+1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}
export function maskName(name) {
  if (!name || name.length < 2) return name;
  if (name.length === 2) return name[0] + '*';
  return name[0] + '*' + name.slice(2);
}
