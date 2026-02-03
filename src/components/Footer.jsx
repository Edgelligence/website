function Footer() {
  const socialLinks = [
    { name: 'Twitter', icon: '𝕏', url: '#' },
    { name: 'LinkedIn', icon: 'in', url: '#' },
    { name: 'GitHub', icon: 'GH', url: '#' },
    { name: 'Instagram', icon: 'IG', url: '#' },
  ];

  return (
    <footer className="w-full px-4 py-8 mt-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                aria-label={social.name}
                className="w-12 h-12 rounded-full bg-gray-800 border border-gray-700 
                           flex items-center justify-center text-gray-300 hover:text-white 
                           hover:bg-gray-700 hover:border-gray-600 transition-all duration-200 
                           font-semibold text-sm"
              >
                {social.icon}
              </a>
            ))}
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 Edgelligence. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
