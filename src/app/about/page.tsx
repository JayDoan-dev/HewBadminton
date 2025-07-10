export default function About() {
  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6">About Hew Badminton Store</h1>
        <p className="text-lg text-gray-600 mb-4">
          At <span className="font-semibold text-orange-600">Hew Badminton Store</span>, we don’t just sell badminton gear —
          we live and breathe the game. Founded by passionate players for players, our mission is to help you unlock your full potential on the court.
        </p>
        <p className="text-lg text-gray-600 mb-4">
          Whether you’re a beginner finding your first racket or a seasoned athlete looking for pro-level equipment, we’re here
          to guide you with expert advice, high-quality products, and unbeatable service.
        </p>
        <p className="text-lg text-gray-600 mb-4">
          Every item we stock is carefully chosen to meet the needs of all play styles — offensive, defensive, and all-rounders —
          so you can focus on your game while we handle the rest.
        </p>
        <p className="text-lg text-gray-600">
          Thank you for making us a part of your badminton journey. Let’s smash new limits together!
        </p>
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Why Choose Us?</h2>
          <ul className="text-left max-w-md mx-auto text-gray-600 space-y-2">
            <li>🏸 Expert-curated rackets, shoes, and accessories</li>
            <li>🏆 Trusted by hundreds of players across all levels</li>
            <li>💬 Friendly, knowledgeable support team</li>
            <li>🚀 Fast and secure shipping nationwide</li>
            <li>❤️ A community that celebrates your love of the sport</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
