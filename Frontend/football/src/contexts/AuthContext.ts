import { createContext } from "react";
import type { AuthContextType } from "./AuthTypes.ts";
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
