import React from "react";

interface Props {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: Props) => {
    return (
        <div className="relative min-h-screen">
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,#000_65%,transparent_100%)]" />
            {children}
        </div>
    );
};

export default AdminLayout;
