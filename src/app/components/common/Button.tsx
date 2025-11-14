"use client";

import React from "react";

export type ButtonVariant =
  | "dark-gray"
  | "medium-gray"
  | "black"
  | "light-gray"
  | "bright-green"
  | "medium-green"
  | "dark-green"
  | "outline-white"
  | "outline-gray"
  | "outline-green";

export type ButtonSize = "large" | "medium" | "small";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export default function Button({
  children,
  variant = "dark-gray",
  size = "medium",
  disabled = false,
  fullWidth = false,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  // variant 클래스 매핑
  const variantClasses: Record<ButtonVariant, string> = {
    "dark-gray": "btn-dark-gray",
    "medium-gray": "btn-medium-gray",
    black: "btn-black",
    "light-gray": "btn-light-gray",
    "bright-green": "btn-bright-green",
    "medium-green": "btn-medium-green",
    "dark-green": "btn-dark-green",
    "outline-white": "btn-outline-white",
    "outline-gray": "btn-outline-gray",
    "outline-green": "btn-outline-green",
  };

  // size 클래스 매핑
  const sizeClasses: Record<ButtonSize, string> = {
    large: "btn-large",
    medium: "btn-medium",
    small: "btn-small",
  };

  const baseClasses = "btn-base";
  const variantClass = variantClasses[variant];
  const sizeClass = sizeClasses[size];
  const widthClass = fullWidth ? "w-full" : "";

  const classes = [
    baseClasses,
    variantClass,
    sizeClass,
    widthClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}

