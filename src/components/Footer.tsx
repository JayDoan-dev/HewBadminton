"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-14 relative bg-black text-neutral-100 overflow-hidden">
      {/* Background glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a]/80 via-[#0f0f0f]/70 to-black/80 backdrop-blur-lg z-0" />

      <div className="relative z-10 py-16 px-6 md:px-16 lg:px-32">
        {/* 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* 1. LOGO + CONTACT */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="transition-transform hover:scale-105">
              <Image
                src="/images/Logo.png"
                alt="Logo"
                width={140}
                height={140}
                className="rounded-md"
              />
            </Link>
            <p className="text-sm text-neutral-300">
              71 Trần Quang Diệu, Phường 14, Quận 3, Hồ Chí Minh, Vietnam
            </p>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> +1 (778) 922 1092
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> hewbadminton@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Hồ Chí Minh, Vietnam
              </li>
            </ul>
            <div className="flex gap-4 mt-2">
              <Link href="#"><Facebook className="w-5 h-5 hover:text-blue-500" /></Link>
              <Link href="#"><Instagram className="w-5 h-5 hover:text-pink-400" /></Link>
              <Link href="#"><Twitter className="w-5 h-5 hover:text-blue-400" /></Link>
            </div>
          </div>

          {/* 2. COMPANY */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="#" className="hover:text-white">Careers</Link></li>
              <li><Link href="#" className="hover:text-white">Affiliates</Link></li>
              <li><Link href="#" className="hover:text-white">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          {/* 3. SHOP */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li><Link href="#" className="hover:text-white">New Arrivals</Link></li>
              <li><Link href="#" className="hover:text-white">Accessories</Link></li>
              <li><Link href="#" className="hover:text-white">Men</Link></li>
              <li><Link href="#" className="hover:text-white">Women</Link></li>
              <li><Link href="/products" className="hover:text-white">All Products</Link></li>
            </ul>
          </div>

          {/* 4. HELP */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li><Link href="#" className="hover:text-white">Customer Service</Link></li>
              <li><Link href="#" className="hover:text-white">My Account</Link></li>
              <li><Link href="#" className="hover:text-white">Find a Store</Link></li>
              <li><Link href="#" className="hover:text-white">Legal & Privacy</Link></li>
              <li><Link href="#" className="hover:text-white">Gift Card</Link></li>
            </ul>
          </div>

          {/* 5. SUBSCRIBE */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
              <p className="text-sm text-neutral-300 mb-4">
                Be the first to get the latest news about trends, promotions, and more!
              </p>
              <div className="flex rounded overflow-hidden bg-neutral-800">
                <input
                  type="email"
                  placeholder="Email address"
                  className="p-3 text-sm w-full bg-transparent text-white placeholder-neutral-400 outline-none"
                />
                <button className="bg-orange-500 px-4 text-white text-sm hover:bg-orange-600">
                  JOIN
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Secure Payments</h4>
              <div className="flex gap-3">
                <Image src="/discover.png" alt="discover" width={40} height={24} />
                <Image src="/skrill.png" alt="skrill" width={40} height={24} />
                <Image src="/paypal.png" alt="paypal" width={40} height={24} />
                <Image src="/mastercard.png" alt="mastercard" width={40} height={24} />
                <Image src="/visa.png" alt="visa" width={40} height={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-12 pt-6 border-t border-neutral-700 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-400 gap-4">
          <div>&copy; {new Date().getFullYear()} Hew Badminton. All rights reserved.</div>
          <div className="flex flex-col md:flex-row gap-6">
            <div>
              <span className="text-neutral-500 mr-2">Language:</span>
              <span className="font-medium">United States | English</span>
            </div>
            <div>
              <span className="text-neutral-500 mr-2">Currency:</span>
              <span className="font-medium">$ CAD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
