"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Menu from "./Menu";
import SearchBar from "./SearchBar";
import dynamic from "next/dynamic";
import { useWixClient } from "@/hooks/useWixClient";
// import NavIcons from "./NavIcons";

const NavIcons = dynamic(() => import("./NavIcons"), { ssr: false });

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const wixClient = useWixClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check login state using Wix auth
    const checkLogin = async () => {
      try {
        const loggedIn = await wixClient.auth.loggedIn();
        setIsLoggedIn(loggedIn);
        if (loggedIn) {
          const res = await wixClient.members.getCurrentMember();
          setUser(res.member ?? null);
        } else {
          setUser(null);
        }
      } catch {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    checkLogin();
  }, [wixClient]);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 h-20 transition-all duration-300
        backdrop-blur-md bg-white/30 border-b border-white/20
        ${isScrolled ? "shadow-lg" : "shadow-none"}`}
    >
      {/* MOBILE */}
      <div className="h-full flex items-center justify-between md:hidden">
        <Link href="/">
          <Image src="/images/Logo.png" alt="Logo" width={120} height={120} />
        </Link>
        {isLoggedIn && user?.profile?.nickname && (
          <span className="ml-2 text-base font-semibold text-gray-700">
            Hi, {user.profile.nickname}!
          </span>
        )}
        <Menu />
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex items-center justify-between gap-8 h-full">
        <div className="w-1/3 xl:w-1/2 flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/Logo.png"
              alt="Logo"
              width={120}
              height={120}
              priority
            />
          </Link>
          <div className="hidden xl:flex gap-10 text-base md:text-md font-medium text-gray-800">
            <Link
              href="/"
              className="relative hover:text-orange-500 transition-colors duration-300 before:absolute before:-bottom-1 before:left-0 before:h-0.5 before:w-0 before:bg-gradient-to-r before:from-orange-400 before:to-orange-600 before:transition-all before:duration-300 hover:before:w-full"
            >
              Home
            </Link>
            <Link
              href="/list?cat=all-products"
              className="relative hover:text-orange-500 transition-colors duration-300 before:absolute before:-bottom-1 before:left-0 before:h-0.5 before:w-0 before:bg-gradient-to-r before:from-orange-400 before:to-orange-600 before:transition-all before:duration-300 hover:before:w-full"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="relative hover:text-orange-500 transition-colors duration-300 before:absolute before:-bottom-1 before:left-0 before:h-0.5 before:w-0 before:bg-gradient-to-r before:from-orange-400 before:to-orange-600 before:transition-all before:duration-300 hover:before:w-full"
            >
              About
            </Link>
            <Link
              href="/deals"
              className="relative hover:text-orange-500 transition-colors duration-300 before:absolute before:-bottom-1 before:left-0 before:h-0.5 before:w-0 before:bg-gradient-to-r before:from-orange-400 before:to-orange-600 before:transition-all before:duration-300 hover:before:w-full"
            >
              Deals
            </Link>
            <Link
              href="/contact"
              className="relative hover:text-orange-500 transition-colors duration-300 before:absolute before:-bottom-1 before:left-0 before:h-0.5 before:w-0 before:bg-gradient-to-r before:from-orange-400 before:to-orange-600 before:transition-all before:duration-300 hover:before:w-full"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="w-2/3 xl:w-1/2 flex items-center justify-between gap-8">
          <SearchBar />
          <NavIcons />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
