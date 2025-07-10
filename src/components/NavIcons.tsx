"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CartModal from "./CartModal";
import { useWixClient } from "@/hooks/useWixClient";
import Cookies from "js-cookie";
import { useCartStore } from "@/hooks/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@wix/stores";

type Member = {
  _id?: string | null;
  profile?: {
    nickname?: string | null;
    email?: string | null;
  };
};

const NavIcons = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<Member | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "Discount available on your first purchase!" },
  ]);

  const router = useRouter();
  const wixClient = useWixClient();
  const profileRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const { cart, counter, getCart } = useCartStore();
  const [allVariants, setAllVariants] = useState<products.Variant[]>([]);

  useEffect(() => {
    getCart(wixClient);
  }, [wixClient, getCart]);

  // Fetch all variants for products in the cart
  useEffect(() => {
    const fetchVariants = async () => {
      if (!cart?.lineItems?.length) {
        setAllVariants([]);
        return;
      }
      const variantArrays: products.Variant[][] = await Promise.all(
        cart.lineItems.map(async (item) => {
          const catalogId = item.catalogReference?.catalogItemId;
          if (!catalogId) return [];
          try {
            const product = await wixClient.products.getProduct(catalogId);
            // Try both product.variants and product.product?.variants for compatibility
            return (product as any).variants || product.product?.variants || [];
          } catch (e) {
            return [];
          }
        })
      );
      setAllVariants(variantArrays.flat());
    };
    fetchVariants();
  }, [cart, wixClient]);

  useEffect(() => {
    const fetchUser = async () => {
      const loggedIn = await wixClient.auth.loggedIn();
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        const res = await wixClient.members.getCurrentMember();
        console.log("Current member:", res);
        setUser(res.member ?? null);
      }

      setLoadingUser(false);
    };

    fetchUser();
  }, [wixClient]);

  const handleProfile = () => {
    if (loadingUser) return;
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setIsProfileOpen((prev) => !prev);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    Cookies.remove("refreshToken");
    const { logoutUrl } = await wixClient.auth.logout(window.location.href);
    setIsLoading(false);
    setIsProfileOpen(false);
    router.push(logoutUrl);
  };

  useEffect(() => {
    const closeAll = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        cartRef.current &&
        !cartRef.current.contains(event.target as Node)
      ) {
        setIsCartOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", closeAll);
    return () => {
      document.removeEventListener("mousedown", closeAll);
    };
  }, []);

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      {/* Profile */}
      <Image
        src="/profile.png"
        alt="Profile"
        width={22}
        height={22}
        className={`cursor-pointer ${loadingUser ? "opacity-50 pointer-events-none" : ""}`}
        onClick={handleProfile}
      />

      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            ref={profileRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            transition={{ duration: 0.2 }}
            className="absolute p-4 rounded-xl top-10 right-24 bg-white text-sm z-20 w-56
              shadow-[0_4px_6px_rgba(0,0,0,0.1),0_-4px_6px_rgba(0,0,0,0.05)]"
          >
            <div className="mb-4">
              <p className="font-medium text-gray-700">
                Hello, {user?.profile?.nickname || "User"}
              </p>
            </div>

            <Link
              href="/profile"
              className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800"
              onClick={() => setIsProfileOpen(false)}
            >
              My Profile
            </Link>

            <Link
              href="/orders"
              className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800"
              onClick={() => setIsProfileOpen(false)}
            >
              My Orders
            </Link>

            <Link
              href="/settings"
              className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800"
              onClick={() => setIsProfileOpen(false)}
            >
              Settings
            </Link>

            <hr className="my-2" />

            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
              disabled={isLoading}
            >
              {isLoading ? "Logging out..." : "Logout"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification */}
      <div
        className="relative cursor-pointer"
        onClick={() => setIsNotificationOpen((prev) => !prev)}
      >
        <Image
          src="/notification.png"
          alt="Notifications"
          width={22}
          height={22}
        />
        {notifications.length > 0 && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
            {notifications.length}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isNotificationOpen && (
          <motion.div
            ref={notificationRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            transition={{ duration: 0.2 }}
            className="absolute top-10 right-16 bg-white rounded-xl p-4 w-64 z-20
              shadow-[0_4px_6px_rgba(0,0,0,0.1),0_-4px_6px_rgba(0,0,0,0.05)]"
          >
            <h3 className="text-sm font-semibold mb-2 text-gray-700">Notifications</h3>
            <ul className="text-sm text-gray-600 space-y-1 max-h-40 overflow-y-auto">
              {notifications.length === 0 ? (
                <li>No new notifications</li>
              ) : (
                notifications.map((n) => (
                  <li key={n.id} className="px-2 py-1 rounded hover:bg-gray-100 cursor-pointer">
                    {n.text}
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart */}
      <div
        className="relative cursor-pointer"
        onClick={() => setIsCartOpen((prev) => !prev)}
      >
        <Image src="/cart.png" alt="Cart" width={22} height={22} />
        <div className="absolute -top-3 -right-3 w-5 h-5 bg-orange-500 text-white rounded-full text-sm flex items-center justify-center">
          {counter}
        </div>
      </div>

      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            ref={cartRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            transition={{ duration: 0.2 }}
            className="absolute bottom-6 right-0 z-20"
          >
            <CartModal variants={allVariants} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavIcons;
