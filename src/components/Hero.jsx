function Hero() {
  return (
    <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
        Edgelligence
      </h1>
      <p className="text-xl md:text-2xl text-blue-400 mb-8 font-semibold">
        Unveiling the Intelligent Edge: AI for and on the Network Periphery
      </p>
      <p className="text-base md:text-lg text-gray-300 max-w-3xl leading-relaxed mb-8">
        At the forefront of edge intelligence, our research group relentlessly pursues breakthroughs. 
        By fostering a culture of diverse perspectives, we cultivate an environment that unlocks 
        the power of AI at the network edge, pioneering the future of intelligent, distributed computing.
      </p>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mb-8">
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-blue-400 mb-3">AI for the Edge</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            We develop AI techniques to optimize edge computing performance, enabling faster 
            processing and smarter decision-making at the network edge.
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-blue-400 mb-3">AI at the Edge</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            We unlock the potential of distributed and federated learning, allowing AI models 
            to run efficiently on edge devices, enabling new possibilities for secure and 
            localized intelligence.
          </p>
        </div>
      </div>
      <p className="text-lg md:text-xl text-white font-semibold">
        Shape the future of next-level computing, one intelligent edge at a time: join our team!
      </p>
    </section>
  );
}

export default Hero;
