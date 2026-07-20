interface SettingsListItemProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

export default function SettingsListItem({ label, onClick, disabled }: SettingsListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-between border-b border-border py-3 text-left text-base text-text last:border-b-0 disabled:text-text-tertiary"
    >
      {label}
      <span aria-hidden>›</span>
    </button>
  )
}
