import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => twMerge(clsx(inputs));

export const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const toInputDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().split("T")[0];
};

export const getInitials = (name = "User") =>
  name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const getValueByPath = (item, path) => {
  if (!item || !path) {
    return undefined;
  }

  return path.split(".").reduce((value, key) => value?.[key], item);
};

export const truncate = (value, length = 60) => {
  if (!value) {
    return "-";
  }

  const stringValue = String(value);
  return stringValue.length > length
    ? `${stringValue.slice(0, length)}...`
    : stringValue;
};

