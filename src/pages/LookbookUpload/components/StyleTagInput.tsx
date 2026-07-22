import { useState, type KeyboardEvent } from 'react'

interface StyleTagInputProps {
  label?: string
  tags: string[]
  onChange: (tags: string[]) => void
  suggestions: string[]
  maxTags?: number
}

export default function StyleTagInput({
  label = '스타일 태그',
  tags,
  onChange,
  suggestions,
  maxTags = 5,
}: StyleTagInputProps) {
  const [inputValue, setInputValue] = useState('')

  const filteredSuggestions =
    inputValue.startsWith('#') && inputValue.length > 1
      ? suggestions.filter(
          (tag) => tag.includes(inputValue.slice(1)) && !tags.includes(tag),
        )
      : []

  const confirmTag = (rawTag: string) => {
    const tag = rawTag.replace(/^#/, '').trim()
    if (!tag || tags.includes(tag) || tags.length >= maxTags) return
    onChange([...tags, tag])
    setInputValue('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      confirmTag(inputValue)
    }
  }

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag))
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-text">{label}</span>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => removeTag(tag)}
              className="rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-800"
            >
              #{tag} ✕
            </button>
          ))}
        </div>
      )}
      {tags.length < maxTags && (
        <div className="relative">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="#미니멀 #스트릿"
            className="h-11 w-full rounded-lg border border-border px-4 text-base focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          {filteredSuggestions.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-white shadow-md">
              {filteredSuggestions.map((tag) => (
                <li key={tag}>
                  <button
                    type="button"
                    onClick={() => confirmTag(tag)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-bg-secondary"
                  >
                    #{tag}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <span className="text-xs text-text-tertiary">
        {tags.length}/{maxTags}
      </span>
    </div>
  )
}
