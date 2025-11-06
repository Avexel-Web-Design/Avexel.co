import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const CommunicationsGuide: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the markdown file
    fetch('/COMMUNICATIONS-GUIDE.md')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load communications guide');
        }
        return response.text();
      })
      .then((text) => {
        setMarkdown(text);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading Communications Guide...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Communications Guide
          </h1>
          <p className="text-gray-400 text-lg">
            Internal documentation for client communications and project management
          </p>
        </div>

        {/* Markdown Content */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
          <div className="p-8 md:p-12">
            <article className="prose prose-invert prose-lg max-w-none
              prose-headings:text-white prose-headings:font-bold
              prose-h1:text-4xl prose-h1:mb-6 prose-h1:border-b prose-h1:border-gray-700 prose-h1:pb-4
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-primary-400
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-primary-300
              prose-p:text-gray-300 prose-p:leading-relaxed
              prose-a:text-primary-400 prose-a:no-underline hover:prose-a:text-primary-300 hover:prose-a:underline
              prose-strong:text-white prose-strong:font-semibold
              prose-ul:text-gray-300 prose-ul:my-4
              prose-ol:text-gray-300 prose-ol:my-4
              prose-li:my-2
              prose-code:text-primary-300 prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
              prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700
              prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:text-gray-400 prose-blockquote:italic
              prose-hr:border-gray-700 prose-hr:my-8
              prose-table:text-gray-300
              prose-th:text-white prose-th:bg-gray-800
              prose-td:border-gray-700">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </article>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>This document is automatically synced from the repository.</p>
          <p className="mt-2">
            For updates or questions, contact the development team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunicationsGuide;
