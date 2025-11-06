import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

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

  // Smooth scroll to anchor links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.slice(1);
        const element = document.getElementById(id || '');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
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
    <div className="min-h-screen bg-black pt-32 pb-20 px-4 sm:px-6 lg:px-8">
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
            <article className="prose prose-invert prose-xl max-w-none
              prose-headings:text-white prose-headings:font-bold prose-headings:scroll-mt-20
              prose-h1:text-5xl prose-h1:mb-8 prose-h1:mt-12 prose-h1:border-b-2 prose-h1:border-gray-700 prose-h1:pb-6 first:prose-h1:mt-0
              prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:text-primary-400 prose-h2:border-b prose-h2:border-gray-800 prose-h2:pb-4
              prose-h3:text-3xl prose-h3:mt-12 prose-h3:mb-4 prose-h3:text-primary-300
              prose-h4:text-2xl prose-h4:mt-8 prose-h4:mb-3 prose-h4:text-gray-200
              prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
              prose-a:text-primary-400 prose-a:font-medium prose-a:no-underline prose-a:transition-colors hover:prose-a:text-primary-300
              prose-strong:text-white prose-strong:font-bold
              prose-em:text-gray-400 prose-em:italic
              prose-ul:text-gray-300 prose-ul:my-6 prose-ul:space-y-3
              prose-ol:text-gray-300 prose-ol:my-6 prose-ol:space-y-3
              prose-li:text-lg prose-li:leading-relaxed
              prose-li:marker:text-primary-400
              prose-code:text-primary-300 prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-base prose-code:font-mono
              prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-lg prose-pre:p-6 prose-pre:overflow-x-auto
              prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-gray-800/50 prose-blockquote:text-gray-300 prose-blockquote:italic prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:my-8
              prose-hr:border-gray-700 prose-hr:my-12 prose-hr:border-t-2
              prose-table:text-gray-300 prose-table:w-full prose-table:my-8
              prose-thead:border-b-2 prose-thead:border-gray-700
              prose-th:text-white prose-th:bg-gray-800 prose-th:p-4 prose-th:text-left prose-th:font-bold
              prose-td:border-gray-700 prose-td:p-4 prose-td:border-t
              prose-tr:border-b prose-tr:border-gray-800">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeSlug,
                  [rehypeAutolinkHeadings, { behavior: 'wrap' }]
                ]}
              >
                {markdown}
              </ReactMarkdown>
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
