function Hero() {
  return (
    <section className="text-center max-w-3xl mx-auto" aria-labelledby="hero-heading">
      <span className="inline-block px-3 py-1 mb-4 text-xs sm:text-sm font-medium 
                       text-blue-700 dark:text-blue-300
                       bg-blue-50 dark:bg-blue-950/50
                       border border-blue-200 dark:border-blue-800
                       rounded-full">
        Coming Soon
      </span>
      
      <h1 
        id="hero-heading"
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 sm:mb-4"
      >
        Unveiling the Intelligent Edge
      </h1>
      
      <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-4 sm:mb-6">
        AI for and on the network periphery—pioneering the future of distributed, edge-native intelligence.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center text-sm text-slate-500 dark:text-slate-500">
        <div className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>AI for the Edge</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>AI on the Edge</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
