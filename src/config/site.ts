export type HireStatus = "open" | "passive" | "closed";

export const hireStatusConfig: Record<HireStatus, {
  label: { ko: string; en: string };
  color: string;
  bgColor: string;
  borderColor: string;
  show: boolean;
}> = {
  open: {
    label: { ko: "채용 가능", en: "Available for Hire" },
    color: "text-green-400",
    bgColor: "bg-green-400",
    borderColor: "border-green-400",
    show: true,
  },
  passive: {
    label: { ko: "제안 환영", en: "Open to Offers" },
    color: "text-yellow-400",
    bgColor: "bg-yellow-400",
    borderColor: "border-yellow-400",
    show: true,
  },
  closed: {
    label: { ko: "구직 안함", en: "Not Looking" },
    color: "text-gray-400",
    bgColor: "bg-gray-400",
    borderColor: "border-gray-400",
    show: false,
  },
};

export function getHireStatus(): HireStatus {
  const status = process.env.NEXT_PUBLIC_HIRE_STATUS as HireStatus;
  return status && ["open", "passive", "closed"].includes(status) ? status : "open";
}

export function getHireStatusConfig() {
  const status = getHireStatus();
  return { status, ...hireStatusConfig[status] };
}
