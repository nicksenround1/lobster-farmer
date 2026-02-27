"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { saveRefCode } from "@/lib/referral";

export default function RefCapture() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref && ref.trim()) {
      // Save to localStorage with timestamp
      saveRefCode(ref.trim());

      // Clean the URL — remove ref param without page reload
      const params = new URLSearchParams(searchParams.toString());
      params.delete("ref");
      const newQuery = params.toString();
      const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  return null;
}
