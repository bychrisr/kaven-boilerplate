import * as React from 'react';

export interface CssBaselineProps {
  /**
   * Enable color scheme
   */
  enableColorScheme?: boolean;
  children?: React.ReactNode;
}

/**
 * CssBaseline component
 * Provides a consistent baseline for styling across browsers
 */
export const CssBaseline: React.FC<CssBaselineProps> = ({ enableColorScheme = true, children }) => {
  React.useEffect(() => {
    // Inject global styles
    const styleId = 'css-baseline-styles';

    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* Box sizing rules */
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        /* Remove default margin */
        * {
          margin: 0;
        }

        /* Set core root defaults */
        html {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-size-adjust: 100%;
          ${enableColorScheme ? 'color-scheme: light dark;' : ''}
        }

        html:focus-within {
          scroll-behavior: smooth;
        }

        /* Set core body defaults */
        body {
          min-height: 100vh;
          line-height: 1.5;
          text-rendering: optimizeSpeed;
        }

        /* Remove list styles on ul, ol elements with a list role */
        ul[role='list'],
        ol[role='list'] {
          list-style: none;
        }

        /* A elements that don't have a class get default styles */
        a:not([class]) {
          text-decoration-skip-ink: auto;
        }

        /* Make images easier to work with */
        img,
        picture,
        video,
        canvas,
        svg {
          display: block;
          max-width: 100%;
        }

        /* Inherit fonts for inputs and buttons */
        input,
        button,
        textarea,
        select {
          font: inherit;
        }

        /* Remove all animations, transitions and smooth scroll for people that prefer not to see them */
        @media (prefers-reduced-motion: reduce) {
          html:focus-within {
            scroll-behavior: auto;
          }
          
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        /* Remove default button styles */
        button {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
        }

        /* Remove default fieldset styles */
        fieldset {
          border: none;
          padding: 0;
        }

        /* Remove default legend styles */
        legend {
          padding: 0;
        }

        /* Improve text rendering */
        h1, h2, h3, h4, h5, h6 {
          text-wrap: balance;
        }

        p, li {
          text-wrap: pretty;
        }

        /* Focus visible styles */
        :focus-visible {
          outline: 2px solid var(--color-primary-main, #1976d2);
          outline-offset: 2px;
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: var(--color-background-default, #fafafa);
        }

        ::-webkit-scrollbar-thumb {
          background: var(--color-action-disabled, #bdbdbd);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: var(--color-action-active, #757575);
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      // Cleanup on unmount
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [enableColorScheme]);

  return <>{children}</>;
};

CssBaseline.displayName = 'CssBaseline';
