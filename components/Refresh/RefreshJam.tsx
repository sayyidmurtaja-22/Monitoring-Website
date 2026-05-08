"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { param } from "framer-motion/client";

export default function RefreshJam() {
  const [Opened, setOpened] = useState(false);
  const [selectOpt, setSelectOpt] = useState("Pilih Opsi Jam");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const Options = {
    OneHour: { label: "1 Jam", value: String(1 * 60 * 60 * 1000) },
    ThreeHour: { label: "3 Jam", value: String(3 * 60 * 60 * 1000) },
    FiveHour: { label: "5 Jam", value: String(5 * 60 * 60 * 1000) },
  };

  const toggleDropdown = () => setOpened(!Opened);

  const handleOptionClick = (key: keyof typeof Options) => {
    const selectedOption = Options[key];
    setSelectOpt(selectedOption.label);
    setOpened(false);

    const params = new URLSearchParams(searchParams);

    params.set("timeRange", String(selectedOption.value));

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={toggleDropdown}
          className="export ml-auto px-4 py-2 bg-blue-700 text-white dark:bg-blue-950"
        >
          {selectOpt}
        </button>
      </div>

      {Opened && (
        <div className="bg-white origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {Object.entries(Options).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleOptionClick(key as keyof typeof Options)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {value.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
