"use client";

import { useEffect } from "react";
import "../amplify"; // Importar configuración de Amplify

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // La configuración de Amplify se ejecuta al importar
    console.log("Amplify configured");
  }, []);

  return <>{children}</>;
}
