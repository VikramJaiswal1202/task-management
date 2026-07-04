export function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-background p-5">
      <h3 className="mb-4 font-medium">{title}</h3>
      {children}
    </div>
  )
}