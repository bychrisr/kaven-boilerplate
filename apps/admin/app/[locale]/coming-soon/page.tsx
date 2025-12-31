export default function ComingSoonPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-main to-primary-dark px-4">
      <div className="text-center text-white max-w-md">
        <h1 className="text-6xl font-bold mb-4">Coming Soon</h1>
        <p className="text-xl mb-8 opacity-90">
          We&apos;re working on something awesome. Stay tuned!
        </p>

        {/* Email Signup */}
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
          <p className="text-sm mb-4">Get notified when we launch</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="bg-white text-primary-main px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Notify Me
            </button>
          </div>
        </div>

        {/* Countdown (placeholder) */}
        <div className="mt-8 grid grid-cols-4 gap-4">
          {['Days', 'Hours', 'Minutes', 'Seconds'].map((unit, i) => (
            <div key={unit} className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-3xl font-bold">{30 - i * 5}</p>
              <p className="text-xs opacity-75">{unit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
