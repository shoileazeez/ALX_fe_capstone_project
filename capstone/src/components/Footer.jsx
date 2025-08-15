const Footer = () => {
  return (
    <footer className="py-12 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Data Source */}
          <div className="space-y-4">
            <h3 className="font-medium text-white">Data Source</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>
                Market data powered by{" "}
                <a 
                  href="https://coingecko.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                >
                  CoinGecko API
                </a>
              </p>
              <p>Real-time pricing updates every 30 seconds</p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="space-y-4">
            <h3 className="font-medium text-white">Important Notice</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              This tool is for informational purposes only. Cryptocurrency investments 
              carry risk. Always do your own research before making investment decisions.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-medium text-white">Support</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <a 
                href="#help" 
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                Help & FAQ
              </a>
              <a 
                href="#settings" 
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                Settings
              </a>
              <a 
                href="#privacy" 
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-800 mb-6"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© 2025 CryptoTracker. Built with React and Tailwind CSS.</p>
          <p>Data delayed by up to 1 minute. Not financial advice.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;