import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, decimals = 1): string {
  if (Math.abs(value) >= 1000) {
    return `£${(value / 1000).toFixed(decimals)}bn`;
  }
  return `£${value.toFixed(0)}m`;
}

export function formatCurrencyExact(value: number): string {
  if (Math.abs(value) >= 1000) {
    return `£${(value / 1000).toFixed(2)}bn`;
  }
  return `£${value.toFixed(0)}m`;
}

export function daysAgo(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDaysAgo(dateStr: string): string {
  const days = daysAgo(dateStr);
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export function getRiskColor(score: number): string {
  if (score >= 86) return "text-[#DC2626]";
  if (score > 65) return "text-danger";
  if (score > 40) return "text-warning";
  return "text-success";
}

export function getRiskBgColor(score: number): string {
  if (score >= 86) return "bg-[#DC2626]";
  if (score > 65) return "bg-danger";
  if (score > 40) return "bg-warning";
  return "bg-success";
}

export function getContactColor(days: number): string {
  if (days > 60) return "text-danger";
  if (days > 30) return "text-warning";
  return "text-secondary";
}

export function getContactBgColor(days: number): string {
  if (days > 60) return "bg-danger-muted text-danger";
  if (days > 30) return "bg-warning-muted text-warning";
  return "text-secondary";
}
