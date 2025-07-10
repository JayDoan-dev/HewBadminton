export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gray-50">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Contact Us</h1>
        <p className="text-lg text-gray-600 mb-4">
          Have questions or feedback? We’d love to hear from you!
        </p>
        <p className="text-lg text-gray-600 mb-8">
          Send us an email at <a href="mailto:hewsupport@gmail.com" className="text-orange-500 underline">hewsupport@gmail.com</a> or reach out on our social media channels.
        </p>

        <form className="max-w-md mx-auto space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <textarea
            placeholder="Your Message"
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <button
            type="submit"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
