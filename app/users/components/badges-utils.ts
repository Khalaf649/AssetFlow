export function getRoleBadgeStyles(
  role: "ADMIN" | "MANAGER" | "DEVELOPER",
) {
  switch (role) {
    case "ADMIN":
      return "bg-primary text-primary-foreground border-0 font-medium";
    case "MANAGER":
      return "bg-accent text-accent-foreground border-0 font-medium";
    case "DEVELOPER":
      return "bg-secondary text-secondary-foreground border border-border font-medium";
    default:
      return "bg-muted text-muted-foreground border border-border font-medium";
  }
}
