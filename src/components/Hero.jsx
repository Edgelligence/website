function Hero() {
  return (
    <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-4 md:py-6">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 md:mb-5 tracking-tight">
        Edgelligence
      </h1>
      <p className="text-lg md:text-xl lg:text-2xl text-blue-600 dark:text-blue-400 mb-4 md:mb-6 font-semibold">
        Unveiling the Intelligent Edge: AI for and on the Network Periphery
      </p>
      <p className="text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed mb-4 md:mb-6">
        At the forefront of edge intelligence, our research group relentlessly pursues breakthroughs. 
        By fostering a culture of diverse perspectives, we cultivate an environment that unlocks 
        the power of AI at the network edge, pioneering the future of intelligent, distributed computing.
      </p>
      <div className="grid md:grid-cols-2 gap-4 md:gap-5 max-w-4xl mb-4 md:mb-6">
        <div className="bg-white/60 dark:bg-gray-800/50 rounded-lg p-4 md:p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">AI for the Edge</h3>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            We develop AI techniques to optimize edge computing performance, enabling faster 
            processing and smarter decision-making at the network edge.
          </p>
        </div>
        <div className="bg-white/60 dark:bg-gray-800/50 rounded-lg p-4 md:p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">AI at the Edge</h3>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            We unlock the potential of distributed and federated learning, allowing AI models 
            to run efficiently on edge devices, enabling new possibilities for secure and 
            localized intelligence.
          </p>
        </div>
      </div>
      <p className="text-base md:text-lg lg:text-xl text-gray-900 dark:text-white font-semibold">
        Shape the future of next-level computing, one intelligent edge at a time: join our team!
      </p>
    </section>
  );
}

export default Hero;
