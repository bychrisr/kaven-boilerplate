import * as React from 'react';
import { cn } from '@/lib/utils';

export interface MarkdownProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Markdown content
   */
  children: string;
  /**
   * Custom components
   */
  components?: Record<string, React.ComponentType<any>>;
}

export const Markdown: React.FC<MarkdownProps> = ({ className, children, components, ...props }) => {
  const parseMarkdown = (text: string): React.ReactNode => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeBlockLang = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={i} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
              <code className={`language-${codeBlockLang}`}>{codeBlockContent.join('\n')}</code>
            </pre>
          );
          codeBlockContent = [];
          codeBlockLang = '';
          inCodeBlock = false;
        } else {
          codeBlockLang = line.slice(3).trim();
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(<h1 key={i} className="text-4xl font-bold mt-6 mb-4">{line.slice(2)}</h1>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-3xl font-bold mt-5 mb-3">{line.slice(3)}</h2>);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-2xl font-bold mt-4 mb-2">{line.slice(4)}</h3>);
      } else if (line.startsWith('#### ')) {
        elements.push(<h4 key={i} className="text-xl font-bold mt-3 mb-2">{line.slice(5)}</h4>);
      } else if (line.startsWith('##### ')) {
        elements.push(<h5 key={i} className="text-lg font-bold mt-2 mb-1">{line.slice(6)}</h5>);
      } else if (line.startsWith('###### ')) {
        elements.push(<h6 key={i} className="text-base font-bold mt-2 mb-1">{line.slice(7)}</h6>);
      }
      // Lists
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={i} className="ml-4 list-disc">
            {parseInline(line.slice(2))}
          </li>
        );
      } else if (/^\d+\.\s/.test(line)) {
        elements.push(
          <li key={i} className="ml-4 list-decimal">
            {parseInline(line.replace(/^\d+\.\s/, ''))}
          </li>
        );
      }
      // Blockquotes
      else if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={i} className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600">
            {parseInline(line.slice(2))}
          </blockquote>
        );
      }
      // Horizontal rule
      else if (line === '---' || line === '***') {
        elements.push(<hr key={i} className="my-6 border-t border-divider" />);
      }
      // Paragraphs
      else if (line.trim()) {
        elements.push(
          <p key={i} className="my-2">
            {parseInline(line)}
          </p>
        );
      }
      // Empty lines
      else {
        elements.push(<br key={i} />);
      }
    }

    return elements;
  };

  const parseInline = (text: string): React.ReactNode => {
    // Bold
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Inline code
    text = text.replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
    // Links
    text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary-main hover:underline">$1</a>');

    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  return (
    <div
      className={cn(
        'prose prose-gray max-w-none',
        '[&_a]:text-primary-main [&_a:hover]:underline',
        '[&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono',
        className
      )}
      {...props}
    >
      {parseMarkdown(children)}
    </div>
  );
};

Markdown.displayName = 'Markdown';
