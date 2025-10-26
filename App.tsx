import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Platform } from './types';
import { generateHashtags } from './services/geminiService';

// --- Icon Components ---
const SparklesIcon = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.25a.75.75 0 01.75.75v.518a10.473 10.473 0 014.288 1.94l.362-.362a.75.75 0 111.06 1.06l-.362.362a10.473 10.473 0 011.94 4.288h.518a.75.75 0 010 1.5h-.518a10.473 10.473 0 01-1.94 4.288l.362.362a.75.75 0 11-1.06 1.06l-.362-.362a10.473 10.473 0 01-4.288 1.94v.518a.75.75 0 01-1.5 0v-.518a10.473 10.473 0 01-4.288-1.94l-.362.362a.75.75 0 11-1.06-1.06l.362-.362a10.473 10.473 0 01-1.94-4.288H2.25a.75.75 0 010-1.5h.518a10.473 10.473 0 011.94-4.288l-.362-.362a.75.75 0 011.06-1.06l.362.362A10.473 10.473 0 0111.25 3.518V3a.75.75 0 01.75-.75zm.75 5.25a.75.75 0 01.75.75v.008c.728.054 1.43.19 2.1.394a.75.75 0 01.597.915l-.261.966a.75.75 0 01-.915.597 7.47 7.47 0 00-1.522-.33V12a.75.75 0 01-1.5 0v-.942a7.47 7.47 0 00-1.522.33.75.75 0 01-.915-.597l-.261-.966a.75.75 0 01.597-.915 11.962 11.962 0 002.1-.394V8.25a.75.75 0 01.75-.75zm-3 8.25a.75.75 0 01.75.75v.008c.728.054 1.43.19 2.1.394a.75.75 0 01.597.915l-.261.966a.75.75 0 01-.915.597 7.47 7.47 0 00-1.522-.33V21a.75.75 0 01-1.5 0v-.942a7.47 7.47 0 00-1.522.33.75.75 0 01-.915-.597l-.261-.966a.75.75 0 01.597-.915 11.962 11.962 0 002.1-.394V16.5a.75.75 0 01.75-.75z" />
  </svg>
);

const InstagramIcon = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.585-.012-4.85-.07c-3.25-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.227 1.664-4.771 4.919-4.919C8.415 2.175 8.796 2.163 12 2.163zm0 1.441c-3.161 0-3.528.012-4.755.068-2.678.122-3.831 1.274-3.953 3.953-.057 1.227-.068 1.594-.068 4.755s.011 3.528.068 4.755c.122 2.678 1.275 3.831 3.953 3.953 1.227.057 1.594.068 4.755.068s3.528-.011 4.755-.068c2.678-.122 3.831-1.275 3.953-3.953.057-1.227.068-1.594.068-4.755s-.011-3.528-.068-4.755c-.122-2.679-1.275-3.831-3.953-3.953C15.528 3.616 15.161 3.604 12 3.604zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm0 1.441a2.31 2.31 0 110 4.62 2.31 2.31 0 010-4.62zM16.804 6.11a1.031 1.031 0 100 2.062 1.031 1.031 0 000-2.062z" />
  </svg>
);

const YouTubeIcon = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.582,6.186c-0.23-0.814-0.908-1.455-1.76-1.673C18.25,4.018,12,4.018,12,4.018s-6.25,0-7.822,0.495 c-0.852,0.218-1.53,0.859-1.76,1.673C2,7.018,2,12,2,12s0,4.982,0.418,5.814c0.23,0.814,0.908,1.455,1.76,1.673 C5.75,19.982,12,19.982,12,19.982s6.25,0,7.822-0.495c0.852-0.218,1.53-0.859,1.76-1.673C22,16.982,22,12,22,12 S22,7.018,21.582,6.186z M9.941,15.604V8.396l6.265,3.604L9.941,15.604z" />
  </svg>
);

const SunIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
);

const MoonIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);

// --- Hooks ---
const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        if (typeof window === 'undefined') return 'light';
        const storedTheme = localStorage.getItem('theme');
        // Explicitly check for 'light' or 'dark' to avoid invalid values.
        if (storedTheme === 'dark' || storedTheme === 'light') {
            return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return [theme, toggleTheme] as const;
};


// --- Components ---
const InteractiveCard: React.FC<{children: React.ReactNode}> = ({ children, ...props }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    const rotateX = (y - 0.5) * -15; // Invert for natural feel
    const rotateY = (x - 0.5) * 15;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="transition-transform duration-300 ease-out"
      {...props}
    >
        {children}
    </div>
  );
};

const AppHeader: React.FC<{ theme: string; toggleTheme: () => void; }> = ({ theme, toggleTheme }) => (
    <header className="absolute top-0 left-0 right-0 p-4 sm:p-6 z-10">
        <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-wide">
                Hashtag AI
            </h1>
            <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-300/70 dark:hover:bg-slate-700/70 transition-colors"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
                {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
        </div>
    </header>
);

const App = () => {
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<Platform>(Platform.Instagram);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [theme, toggleTheme] = useTheme();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a title for your video or reel.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setHashtags([]);

    try {
      const generated = await generateHashtags(title, platform);
      setHashtags(generated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [title, platform]);

  const handleCopy = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const handleCopyAll = () => {
    const allTags = hashtags.join(' ');
    navigator.clipboard.writeText(allTags);
    setCopiedTag('all');
    setTimeout(() => setCopiedTag(null), 2000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 text-slate-900 dark:text-slate-100 relative overflow-hidden">
      <AppHeader theme={theme} toggleTheme={toggleTheme} />
      <div className="w-full max-w-2xl mx-auto">
        <InteractiveCard>
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-900/10 dark:shadow-black/20 overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/10">
            <div className="p-6 sm:p-10">
              <div className="text-center">
                 <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400">
                    AI Hashtag Generator
                 </h2>
                <p className="mt-3 text-slate-600 dark:text-slate-400">
                  Instantly generate viral hashtags for your content.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                  <label htmlFor="platform" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Select Platform
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {(Object.values(Platform) as Platform[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPlatform(p)}
                        className={`flex items-center justify-center gap-3 p-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          platform === p
                            ? 'bg-purple-600 text-white shadow-lg ring-2 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900 ring-purple-500'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {p === Platform.Instagram ? <InstagramIcon /> : <YouTubeIcon />}
                        <span>{p}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Enter your {platform === Platform.Instagram ? 'Reel' : 'Video'} Title
                  </label>
                  <textarea
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., How to make the perfect sourdough bread"
                    rows={3}
                    className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800/50 text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-purple-500 focus:outline-none transition border border-transparent dark:border-slate-700/50"
                    aria-label={`Enter title for ${platform}`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5" />
                      <span>Generate Hashtags</span>
                    </>
                  )}
                </button>
              </form>

              {error && <p className="mt-4 text-center text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">{error}</p>}
              
              {hashtags.length > 0 && (
                <div className="mt-10 animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Generated Hashtags</h3>
                    <button
                      onClick={handleCopyAll}
                      className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      {copiedTag === 'all' ? 'Copied!' : 'Copy All'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                    {hashtags.map((tag, index) => (
                      <button
                        key={tag}
                        onClick={() => handleCopy(tag)}
                        className="fade-in-stagger px-3 py-1.5 text-sm rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:text-purple-700 dark:hover:text-purple-300 transition-colors shadow-sm"
                        style={{ animationDelay: `${index * 20}ms` }}
                        title="Copy"
                      >
                        {copiedTag === tag ? 'Copied!' : tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </InteractiveCard>
      </div>
    </div>
  );
};

export default App;
