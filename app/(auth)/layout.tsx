import React, { ReactNode } from "react";
interface IAuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: IAuthLayoutProps) => {
  return (
    <div className="flex items-center justify-center h-[100vh]">{children}</div>
  );
};

export default AuthLayout;
