"use client";

import { useEffect, useState } from "react";
import { useWixClient } from "@/hooks/useWixClient";
import Image from "next/image";

const MyProfilePage = () => {
  const wixClient = useWixClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await wixClient.members.getCurrentMember();
        setUser(res.member ?? null);
        console.log("User object:", res.member);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [wixClient]);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile Not Found!</h1>
        <p className="text-gray-500 mb-6">Please log in to view your profile!!</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <div className="flex flex-col items-center gap-4 bg-white rounded-xl shadow-lg p-8">
        <Image
          src="/profile.png"
          alt="Profile"
          width={80}
          height={80}
          className="rounded-full border"
        />
        <h1 className="text-2xl font-bold text-gray-800">{user.profile?.nickname || "User"}</h1>
        <p className="text-gray-600">
          {user.profile?.email ? user.profile.email : <span className="italic text-gray-400">Email not available!</span>}
        </p>
        <div className="mt-6 w-full">
          <h2 className="text-lg font-semibold mb-2">Account Details</h2>
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <div className="mb-2">
              <span className="font-medium">Name: </span>
              {user.profile?.nickname || "-"}
            </div>
            <div className="mb-2">
              <span className="font-medium">Email: </span>
              {user.profile?.email ? user.profile.email : <span className="italic text-gray-400">Email not available</span>}
            </div>
            {/* Add more fields as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
