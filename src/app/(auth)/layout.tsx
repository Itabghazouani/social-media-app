import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { validateRequest } from "@/auth";

const Layout = async ({ children }: { children: ReactNode }) => {
  const { user } = await validateRequest();

  if (user) redirect("/");

  return <>{children}</>;
};

export default Layout;
