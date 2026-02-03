import { useEffect, useState } from 'react';

const socialIcons = {
  github: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  ),
  twitter: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
    </svg>
  ),
  email: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
      <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
    </svg>
  ),
};

const socialOrder = ['github', 'twitter', 'linkedin', 'email'];

function Footer() {
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/config/config.json');
        const config = await response.json();
        const socialMedia = config.socialMedia || {};
        
        const links = socialOrder
          .filter(key => socialMedia[key])
          .map(key => ({
            name: socialMedia[key].label,
            icon: socialMedia[key].icon,
            url: socialMedia[key].url,
          }));
        
        setSocialLinks(links);
      } catch {
        setSocialLinks([
          { name: 'GitHub', icon: 'github', url: 'https://github.com/Edgelligence' },
          { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com/edgelligence' },
          { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/company/edgelligence' },
          { name: 'Email', icon: 'email', url: 'mailto:info@edgelligence.com' },
        ]);
      }
    };

    loadConfig();
  }, []);

  return (
    <footer className="flex-shrink-0 w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <nav className="flex items-center gap-1" aria-label="Social media links">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${social.name}`}
              className="p-2 rounded-lg
                         text-slate-500 dark:text-slate-500
                         hover:text-slate-700 dark:hover:text-slate-300
                         hover:bg-slate-100 dark:hover:bg-slate-800
                         transition-colors duration-200"
            >
              {socialIcons[social.icon]}
            </a>
          ))}
        </nav>
        
        <p className="text-xs text-slate-400 dark:text-slate-600">
          © {new Date().getFullYear()} Edgelligence
        </p>
      </div>
    </footer>
  );
}

export default Footer;
