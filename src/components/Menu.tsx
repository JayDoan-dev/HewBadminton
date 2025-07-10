"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  ShoppingBag,
  Tag,
  Info,
  Mail,
  LogOut,
  ShoppingCart,
} from "lucide-react";

const Menu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { label: "Home", href: "/", icon: <Home className="w-5 h-5" /> },
    { label: "Shop", href: "/list?cat=all-products", icon: <ShoppingBag className="w-5 h-5" /> },
    { label: "Deals", href: "/deals", icon: <Tag className="w-5 h-5" /> },
    { label: "About", href: "/about", icon: <Info className="w-5 h-5" /> },
    { label: "Contact", href: "/contact", icon: <Mail className="w-5 h-5" /> },
    { label: "Logout", href: "/logout", icon: <LogOut className="w-5 h-5" /> },
    { label: "Cart", href: "/cart", icon: <ShoppingCart className="w-5 h-5" /> },
  ];

  return (
    <div className="relative z-50" ref={menuRef}>
      {/* Hamburger / X Icon */}
      <div
        className="w-8 h-6 flex flex-col justify-center items-center cursor-pointer relative z-[100]"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span
          className={`absolute w-8 h-0.5 bg-black rounded transition-all duration-300 top-1/2 ${
            open ? "rotate-45" : "-translate-y-[8px]"
          }`}
        />
        <span
          className={`absolute w-8 h-0.5 bg-black rounded transition-all duration-300 top-1/2 ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`absolute w-8 h-0.5 bg-black rounded transition-all duration-300 top-1/2 ${
            open ? "-rotate-45" : "translate-y-[8px]"
          }`}
        />
      </div>

      {/* Full-screen Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed top-0 left-0 w-screen h-screen bg-white flex flex-col justify-center items-center z-40 px-6"
          >
            {links.map(({ label, href, icon }) => (
              <motion.div
                key={label}
                variants={linkVariants}
                className="w-full max-w-md"
              >
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 w-full py-4 px-6 text-center text-xl text-gray-800 transition-all duration-200 hover:bg-orange-100 hover:text-orange-600 rounded-md"
                >
                  {icon}
                  <span className="flex-1 text-left">{label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Menu;
