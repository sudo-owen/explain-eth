import React from 'react';
import { useTranslation } from 'react-i18next';

interface ArticleProps {
  articleKey: string;
  sectionKey?: string; // Optional: render specific section
  className?: string;
  showTitle?: boolean;
}

const Article: React.FC<ArticleProps> = ({ 
  articleKey, 
  sectionKey,
  className = "",
  showTitle = true 
}) => {
  const { t } = useTranslation();
  
  const articleData = t(articleKey, { returnObjects: true });
  
  // Handle case where translation doesn't exist
  if (!articleData || typeof articleData !== 'object') {
    return <div>Article not found: {articleKey}</div>;
  }

  // Helper function to render paragraph arrays
  const renderParagraphs = (paragraphs: string[], additionalClassName = "") => {
    return (
      <div className={`paragraphs mb-6 ${additionalClassName}`}>
        {paragraphs.map((paragraph: string, index: number) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    );
  };

  // Helper function to render bullet lists
  const renderBulletList = (items: string[], highlighted = false) => {
    return (
      <div className="text-gray-300 leading-relaxed mb-6">
        {items.map((item: string, index: number) => (
          <div key={index} className="mb-4">
            <div className="flex items-start">
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-3 flex-shrink-0"></span>
              <div className="flex-1">
                <span className={highlighted ? "text-blue-300" : "text-gray-300"}>{item}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // If specific section requested, render only that section
  if (sectionKey && (articleData as any)[sectionKey]) {
    const sectionData = (articleData as any)[sectionKey];
    if (Array.isArray(sectionData)) {
      return renderParagraphs(sectionData, className);
    }
    return <div className={className}>{String(sectionData)}</div>;
  }

  return (
    <div className={`article-content ${className}`}>
      {showTitle && (articleData as any).title && (
        <h1 className="text-4xl font-bold text-white mb-8">
          {(articleData as any).title}
        </h1>
      )}
      
      {/* Render all paragraph sections dynamically */}
      {Object.entries(articleData as any).map(([key, value]) => {
        if (key === 'title' || key === 'ui') return null;
        
        if (Array.isArray(value)) {
          if (key === 'capabilities') {
            return <div key={key}>{renderBulletList(value, true)}</div>;
          } else if (key === 'examples' || key === 'appTypes') {
            return <div key={key}>{renderBulletList(value, false)}</div>;
          } else {
            return <div key={key}>{renderParagraphs(value)}</div>;
          }
        }
        
        return null;
      })}
    </div>
  );
};

export default Article;