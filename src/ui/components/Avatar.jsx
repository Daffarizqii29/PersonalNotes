export default function Avatar({ src, name, size = 32 }) {
  const initials = (name || '?')
    .split(' ')
    .slice(0, 2)
    .map((s) => s[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className="avatar"
      style={{ width: size, height: size }}
      aria-label={name}
      title={name}
    >
      {src ? <img src={src} alt={name} /> : <span>{initials}</span>}
    </div>
  );
}
