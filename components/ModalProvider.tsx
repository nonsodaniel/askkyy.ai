"use client";

import { useEffect, useState } from "react";
import { UpgradeModal } from "./UpgradeModal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <UpgradeModal />
    </>
  );
};
