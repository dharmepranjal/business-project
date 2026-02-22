export function formatINR(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  } else {
    return `₹${value.toLocaleString('en-IN')}`;
  }
}

export function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
