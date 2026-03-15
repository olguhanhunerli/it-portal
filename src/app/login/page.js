"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "@/components/login/login";

export default function Page() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  return <LoginPage />;
}
