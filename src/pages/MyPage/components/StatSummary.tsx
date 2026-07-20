interface StatSummaryProps {
  saved: number
  analyzed: number
  uploaded: number
}

export default function StatSummary({ saved, analyzed, uploaded }: StatSummaryProps) {
  const stats = [
    { label: '저장', value: saved },
    { label: '분석', value: analyzed },
    { label: '업로드', value: uploaded },
  ]

  return (
    <div className="grid grid-cols-3 gap-2 rounded-lg bg-bg-secondary p-4">
      {stats.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <span className="text-lg font-semibold text-text">{value}</span>
          <span className="text-xs text-text-secondary">{label}</span>
        </div>
      ))}
    </div>
  )
}
