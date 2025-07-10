"use client";

import { useState, useEffect, useRef } from "react";
import {
  Filter as FilterIcon,
  ArrowDownWideNarrow,
  X as CloseIcon,
} from "lucide-react";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Filter = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsPanelOpen(false);
      }
    };
    if (isPanelOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPanelOpen]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams);
    params.set(name, value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative mt-6 flex flex-col lg:flex-row items-start justify-between gap-6">
      {/* Left: Filters */}
      <div className="flex flex-wrap items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-2 text-gray-700">
          <FilterIcon size={18} />
          <span className="text-sm font-semibold">Filters</span>
        </div>

        <select
          name="cat"
          className="py-2 px-4 rounded-xl text-sm bg-[#F5F7F8] text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          onChange={handleFilterChange}
        >
          <option value="">Category</option>
          <option value="all-products">All Products</option>
          <option value="badminton-rackets">Rackets</option>
          <option value="badminton-shoes">Shoes</option>
          <option value="bags">Bags</option>
          <option value="t-shirts">Clothings</option>
          <option value="shuttles">Shuttles</option>
          <option value="accessories">Accessories</option>
        </select>

        <select
          name="brand"
          className="py-2 px-4 rounded-xl text-sm bg-[#F5F7F8] text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          onChange={handleFilterChange}
        >
          <option value="">Brand</option>
          <option value="yonex">Yonex</option>
          <option value="lining">Li-Ning</option>
          <option value="victor">Victor</option>
          <option value="mizuno">Mizuno</option>
        </select>

        <div className="flex items-center gap-2">
          <input
            type="text"
            name="min"
            placeholder="Min"
            className="w-20 py-2 px-3 rounded-xl text-sm bg-[#F5F7F8] text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            onChange={handleFilterChange}
          />
          <span className="text-gray-500">-</span>
          <input
            type="text"
            name="max"
            placeholder="Max"
            className="w-20 py-2 px-3 rounded-xl text-sm bg-[#F5F7F8] text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            onChange={handleFilterChange}
          />
        </div>

        <button
          onClick={() => setIsPanelOpen(true)}
          className="text-sm px-4 py-2 rounded-xl bg-[#F0794A] text-white hover:opacity-90 transition"
        >
          More Filters
        </button>
      </div>

      {/* Right: Sort */}
      <div className="flex items-center gap-2">
        <ArrowDownWideNarrow size={18} className="text-gray-700" />
        <span className="text-sm font-medium text-gray-700">Sort by:</span>
        <select
          name="sort"
          className="py-2 px-4 rounded-xl text-sm bg-white text-gray-800 ring-1 ring-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          onChange={handleFilterChange}
        >
          <option value="">Sort By</option>
          <option value="asc price">Price: Low to High</option>
          <option value="desc price">Price: High to Low</option>
          <option value="asc lastUpdated">Newest</option>
          <option value="desc lastUpdated">Oldest</option>
        </select>
      </div>

      {/* Slide-in Advanced Filter Panel */}
      <div
        className={clsx(
          "fixed top-0 right-0 h-full w-[320px] bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out",
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        )}
        ref={panelRef}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-700">
            Advanced Filters
          </h2>
          <button onClick={() => setIsPanelOpen(false)}>
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Advanced Filter Content */}
        <div className="p-4 flex flex-col gap-4 text-sm text-gray-700">
          <div>
            <label className="block mb-1 font-medium">Search</label>
            <input
              type="text"
              name="search"
              placeholder="Enter keywords"
              className="w-full px-3 py-2 rounded-lg bg-[#F5F7F8] focus:outline-none"
              onChange={handleFilterChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Play Style</label>
            <select
              name="style"
              className="w-full px-3 py-2 rounded-lg bg-[#F5F7F8]"
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="all-round">All-round</option>
              <option value="defensive">Defensive</option>
              <option value="offensive">Offensive</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Brand</label>
            <select
              name="brand"
              className="w-full px-3 py-2 rounded-lg bg-[#F5F7F8]"
              onChange={handleFilterChange}
            >
              <option value="">Any</option>
              <option value="yonex">Yonex</option>
              <option value="lining">Li-Ning</option>
              <option value="victor">Victor</option>
              <option value="mizuno">Mizuno</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Skill Level</label>
            <select
              name="skill"
              className="w-full px-3 py-2 rounded-lg bg-[#F5F7F8]"
              onChange={handleFilterChange}
            >
              <option value="">Any</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="upper-intermediate">Upper-Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Weight</label>
            <select
              name="weight"
              className="w-full px-3 py-2 rounded-lg bg-[#F5F7F8]"
              onChange={handleFilterChange}
            >
              <option value="">Any</option>
              <option value="2u">2U: 90–94g</option>
              <option value="3u">3U: 85–89g</option>
              <option value="4u">4U: 80–84g</option>
              <option value="5u">5U: &lt;80g</option>
              <option value="6u">6U: &lt;75g</option>
              <option value="7u">7U: &lt;70g</option>
            </select>
          </div>

          {/* Reset / Apply (visual only — logic optional) */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => {
                console.log("Reset filters");
              }}
              className="px-4 py-2 rounded-xl border text-gray-600 border-gray-300 hover:bg-gray-100 transition"
            >
              Reset
            </button>
            <button
              onClick={() => {
                console.log("Apply filters");
                setIsPanelOpen(false);
              }}
              className="px-4 py-2 rounded-xl bg-[#F0794A] text-white hover:opacity-90 transition"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
