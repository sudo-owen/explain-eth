import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface FootnoteData {
  id: string;
  number: number;
  content: React.ReactNode;
  order: number; // Track order of appearance
}

interface FootnoteContextType {
  footnotes: FootnoteData[];
  registerFootnote: (footnote: Omit<FootnoteData, 'number' | 'order'>) => void;
  getFootnoteNumber: (id: string) => number;
}

const FootnoteContext = createContext<FootnoteContextType | null>(null);

interface FootnoteProviderProps {
  children: React.ReactNode;
}

export const FootnoteProvider: React.FC<FootnoteProviderProps> = ({
  children,
}) => {
  const [footnotes, setFootnotes] = useState<FootnoteData[]>([]);

  const registerFootnote = useCallback((footnote: Omit<FootnoteData, 'number' | 'order'>) => {
    setFootnotes((prev) => {
      const exists = prev.find((f) => f.id === footnote.id);
      if (exists) {
        return prev; // Already registered
      }

      // Auto-generate number based on order of appearance
      const nextNumber = prev.length + 1;
      const nextOrder = prev.length;

      const newFootnote = { ...footnote, number: nextNumber, order: nextOrder };
      return [...prev, newFootnote];
    });
  }, []);

  const getFootnoteNumber = useCallback((id: string): number => {
    const footnote = footnotes.find((f) => f.id === id);
    return footnote ? footnote.number : 0;
  }, [footnotes]);

  return (
    <FootnoteContext.Provider
      value={{ footnotes, registerFootnote, getFootnoteNumber }}
    >
      {children}
    </FootnoteContext.Provider>
  );
};

interface FootnoteRefProps {
  id: string;
  number?: number; // Optional - will auto-generate if not provided
  children: React.ReactNode;
}

export const FootnoteRef: React.FC<FootnoteRefProps> = ({
  id,
  number,
  children,
}) => {
  const context = useContext(FootnoteContext);

  // Register this footnote with the context
  useEffect(() => {
    if (context) {
      context.registerFootnote({ id, content: children });
    }
  }, [context, id]); // Intentionally exclude children from deps

  // Get the current footnote number
  const actualNumber = context ? context.getFootnoteNumber(id) : (number || 0);

  return (
    <sup className="ml-1 text-sm">
      <a
        id={`ref-${id}`}
        href={`#${id}`}
        className="text-blue-400 hover:text-blue-300 cursor-pointer underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded px-1"
        aria-label={`Go to footnote ${actualNumber}`}
      >
        [{actualNumber}]
      </a>
    </sup>
  );
};

// Internal component for rendering footnote text in the list
const FootnoteTextDisplay: React.FC<{
  id: string;
  number: number;
  children: React.ReactNode;
}> = ({ id, number, children }) => {
  return (
    <div id={id} className="mb-4 text-gray-300 text-sm leading-relaxed">
      <p>
        <span className="text-blue-400 font-medium">{number}.</span> {children}{" "}
        <a
          href={`#ref-${id}`}
          className="text-blue-400 hover:text-blue-300 cursor-pointer underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded px-1"
          aria-label="Return to text"
        >
          ↩
        </a>
      </p>
    </div>
  );
};

export const FootnoteList: React.FC = () => {
  const context = useContext(FootnoteContext);

  if (!context || context.footnotes.length === 0) {
    return null;
  }

  const sortedFootnotes = [...context.footnotes].sort(
    (a, b) => a.number - b.number
  );

  return (
    <div className="mt-16 pt-8 border-t border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-6">Footnotes</h3>
      {sortedFootnotes.map((footnote) => (
        <FootnoteTextDisplay
          key={footnote.id}
          id={footnote.id}
          number={footnote.number}
        >
          {footnote.content}
        </FootnoteTextDisplay>
      ))}
    </div>
  );
};

// Legacy component for backward compatibility
const Footnote: React.FC<{
  url: string;
  children: React.ReactNode;
  number: number;
}> = ({ children, number }) => {
  console.warn(
    "Legacy Footnote component used. Please use FootnoteRef instead."
  );
  return (
    <FootnoteRef id={`footnote-${number}`}>
      {children}
    </FootnoteRef>
  );
};

export default Footnote;
