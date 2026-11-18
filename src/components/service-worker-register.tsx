"use client";

import { useEffect } from "react";

export const ServiceWorkerRegister = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    const { serviceWorker } = navigator;
    const hadController = Boolean(serviceWorker.controller);
    const reloadOnUpdate = () => {
      if (hadController) window.location.reload();
    };

    serviceWorker.addEventListener("controllerchange", reloadOnUpdate);
    void serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
    return () => serviceWorker.removeEventListener("controllerchange", reloadOnUpdate);
  }, []);

  return null;
};
