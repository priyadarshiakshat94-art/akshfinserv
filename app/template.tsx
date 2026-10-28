// Re-mounts on every navigation, giving the 150ms page fade.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-fade">{children}</div>;
}
