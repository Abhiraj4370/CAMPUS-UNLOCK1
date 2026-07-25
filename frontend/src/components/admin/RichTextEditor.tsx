'use client';

import { useRef, useState } from 'react';
import { Bold, Italic, List, Heading2, Link2, Eye, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TOOLS: { icon: typeof Bold; label: string; wrap: [string, string] }[] = [
  { icon: Bold, label: 'Bold', wrap: ['**', '**'] },
  { icon: Italic, label: 'Italic', wrap: ['_', '_'] },
  { icon: Heading2, label: 'Heading', wrap: ['\n## ', '\n'] },
  { icon: List, label: 'List item', wrap: ['\n- ', ''] },
  { icon: Link2, label: 'Link', wrap: ['[', '](https://)'] },
];

/** Renders a minimal markdown preview — bold/italic/headings/lists/links/paragraphs. */
function renderPreview(markdown: string) {
  const html = markdown
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/^## (.*)$/gm, '<h3 class="font-bold text-lg mt-3 mb-1">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary-600 underline">$1</a>')
    .replace(/^- (.*)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .split('\n\n')
    .map((p) => (p.trim() ? `<p class="mb-2">${p}</p>` : ''))
    .join('');
  return html;
}

export function RichTextEditor({ value, onChange, placeholder }: Props) {
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyWrap = (before: string, after: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = start + before.length;
      el.selectionEnd = start + before.length + selected.length;
    });
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between bg-slate-50 border-b border-slate-200 px-2 py-1.5">
        <div className="flex items-center gap-0.5">
          {TOOLS.map((t) => (
            <button
              key={t.label}
              type="button"
              title={t.label}
              onClick={() => applyWrap(t.wrap[0], t.wrap[1])}
              className="w-7 h-7 rounded-md flex items-center justify-center text-slate-600 hover:bg-slate-200"
            >
              <t.icon size={14} />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-0.5">
          <button type="button" onClick={() => setMode('write')} className={cn('w-7 h-7 rounded-md flex items-center justify-center', mode === 'write' ? 'bg-white shadow-sm' : 'text-slate-400')}>
            <Pencil size={13} />
          </button>
          <button type="button" onClick={() => setMode('preview')} className={cn('w-7 h-7 rounded-md flex items-center justify-center', mode === 'preview' ? 'bg-white shadow-sm' : 'text-slate-400')}>
            <Eye size={13} />
          </button>
        </div>
      </div>
      {mode === 'write' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={10}
          className="w-full px-3.5 py-3 text-[13.5px] outline-none resize-y font-mono"
        />
      ) : (
        <div className="px-3.5 py-3 text-[13.5px] min-h-[200px]" dangerouslySetInnerHTML={{ __html: renderPreview(value || '*Nothing to preview yet.*') }} />
      )}
    </div>
  );
}
