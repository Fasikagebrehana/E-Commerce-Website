import type { ReactNode } from "react";

type IconProps = { size?: number; className?: string };

const Icon = ({ size = 20, className, children }: IconProps & { children: ReactNode }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        {children}
    </svg>
);

export const CartIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 8H6.2" />
        <circle cx="9" cy="20" r="1.3" />
        <circle cx="17" cy="20" r="1.3" />
    </Icon>
);

export const SearchIcon = (props: IconProps) => (
    <Icon {...props}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
    </Icon>
);

export const UserIcon = (props: IconProps) => (
    <Icon {...props}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </Icon>
);

export const MenuIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M4 6h16M4 12h16M4 18h16" />
    </Icon>
);

export const CloseIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M6 6l12 12M18 6 6 18" />
    </Icon>
);

export const ChevronDownIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="m6 9 6 6 6-6" />
    </Icon>
);

export const HeartIcon = ({ filled, ...props }: IconProps & { filled?: boolean }) => (
    <Icon {...props}>
        <path fill={filled ? "currentColor" : "none"}
            d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.6 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.4 0 5.6 3.5 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" />
    </Icon>
);

export const TrashIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
    </Icon>
);

export const TruckIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
        <circle cx="7" cy="18" r="1.8" />
        <circle cx="17" cy="18" r="1.8" />
    </Icon>
);

export const ReturnIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M9 14 4 9l5-5" />
        <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
    </Icon>
);

export const ShieldIcon = (props: IconProps) => (
    <Icon {...props}>
        <path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3z" />
        <path d="m9 12 2 2 4-4" />
    </Icon>
);
