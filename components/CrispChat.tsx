"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("d26e866a-df65-4ed1-b430-143ceee057b8");
  }, []);

  return null;
};
