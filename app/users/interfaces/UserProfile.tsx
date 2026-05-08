export default interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "DEVELOPER";
  createdAt: string;
  assignedAssets?: {
    id: string;
    brand: string;
    model: string;
    serialNumber: string;
    type: "LAPTOP" | "MONITOR" | "ACCESSORY";
    status: "AVAILABLE" | "ASSIGNED" | "UNDER_REPAIR" | "DECOMMISSIONED";
  }[];
}
