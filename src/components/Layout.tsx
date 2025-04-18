
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { StickyFooter } from "./StickyFooter";

const Layout = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 pb-20">
        <Outlet />
      </main>
      <StickyFooter />
    </div>
  );
};

export default Layout;
