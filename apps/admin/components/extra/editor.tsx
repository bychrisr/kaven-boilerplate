import * as React from 'react';
import { Bold, Italic, List, ListOrdered, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EditorProps {
  /**
   * Value
   */
  value?: string;
  /**
   * Callback when content changes
   */
  onChange?: (value: string) => void;
  /**
   * Placeholder
   */
  placeholder?: string;
  /**
   * Read only
   */
  readOnly?: boolean;
}

export const Editor: React.FC<EditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Escreva algo...',
  readOnly = false,
}) => {
  const [content, setContent] = React.useState(value);
  const editorRef = React.useRef<HTMLDivElement>(null);

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleInput = () => {
    const newContent = editorRef.current?.innerHTML || '';
    setContent(newContent);
    onChange?.(newContent);
  };

  return (
    <div className="border border-divider rounded-lg overflow-hidden">
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex items-center gap-1 p-2 border-b border-divider bg-background-default">
          <button
            type="button"
            onClick={() => handleFormat('bold')}
            className="p-2 hover:bg-action-hover rounded transition-colors"
            title="Negrito"
          >
            <Bold className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('italic')}
            className="p-2 hover:bg-action-hover rounded transition-colors"
            title="Itálico"
          >
            <Italic className="size-4" />
          </button>
          <div className="w-px h-6 bg-divider mx-1" />
          <button
            type="button"
            onClick={() => handleFormat('insertUnorderedList')}
            className="p-2 hover:bg-action-hover rounded transition-colors"
            title="Lista"
          >
            <List className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => handleFormat('insertOrderedList')}
            className="p-2 hover:bg-action-hover rounded transition-colors"
            title="Lista Numerada"
          >
            <ListOrdered className="size-4" />
          </button>
          <div className="w-px h-6 bg-divider mx-1" />
          <button
            type="button"
            onClick={() => handleFormat('formatBlock', 'pre')}
            className="p-2 hover:bg-action-hover rounded transition-colors"
            title="Código"
          >
            <Code className="size-4" />
          </button>
        </div>
      )}

      {/* Editor Content */}
      <div
        ref={editorRef}
        contentEditable={!readOnly}
        onInput={handleInput}
        className={cn(
          'min-h-[200px] p-4 focus:outline-none',
          'prose prose-sm max-w-none',
          '[&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded',
          readOnly && 'cursor-default'
        )}
        dangerouslySetInnerHTML={{ __html: content }}
        data-placeholder={placeholder}
      />
    </div>
  );
};

Editor.displayName = 'Editor';
