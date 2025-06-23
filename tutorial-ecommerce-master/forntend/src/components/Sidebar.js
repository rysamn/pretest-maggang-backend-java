import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "primereact/menu";
import { useAuth } from "../auth/useAuth";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const Sidebar = () => {
    const { signout, user } = useAuth();
    const location = useLocation();

    // Common function to create menu items with active state
    const createMenuItem = (label, icon, path) => ({
        label,
        icon: `pi ${icon}`,
        template: (item, options) => {
            const isActive = location.pathname === path;
            return (
                <Link 
                    to={path} 
                    className={`${options.className} ${isActive ? 'active-menu-item' : ''}`}
                >
                    <span className={options.iconClassName}></span>
                    <span className={options.labelClassName}>{item.label}</span>
                </Link>
            );
        }
    });

    const userMenus = [
        createMenuItem("Dashboard", "pi-th-large", "/user/dashboard"),
        createMenuItem("Produk", "pi-shopping-bag", "/user/produk"),
        createMenuItem("Keranjang", "pi-shopping-cart", "/user/keranjang"),
        createMenuItem("Checkout", "pi-credit-card", "/user/checkout"),
        createMenuItem("Riwayat Pesanan", "pi-history", "/user/orders"),
        {
            label: "Sign Out",
            icon: "pi pi-sign-out",
            command: () => signout(),
            className: "signout-menu-item"
        }
    ];

    const adminMenus = [
        createMenuItem("Dashboard", "pi-th-large", "/admin/dashboard"),
        createMenuItem("Pesanan", "pi-shopping-cart", "/admin/pesanan"),
        createMenuItem("Kategori", "pi-tags", "/admin/kategori"),
        createMenuItem("Produk", "pi-box", "/admin/produk"),
        createMenuItem("Pengguna", "pi-users", "/admin/pengguna"),
        {
            label: "Sign Out",
            icon: "pi pi-sign-out",
            command: () => signout(),
            className: "signout-menu-item"
        }
    ];

    return (
        <div className="sidebar-container">
            <div className="sidebar-header">
                <h3>E-Commerce</h3>
                <div className="user-info">
                    <i className="pi pi-user"></i>
                    <span>{user?.role === "admin" ? "Admin" : "User"}</span>
                </div>
            </div>
            <Menu 
                model={user?.role === "admin" ? adminMenus : userMenus} 
                className="sidebar-menu"
            />
        </div>
    );
};

export default Sidebar;