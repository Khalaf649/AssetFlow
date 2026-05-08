"use client";

import { Check, X } from "lucide-react";

const passwordChecks = [
  { label: "At least 8 characters", regex: /.{8,}/ },
  { label: "One uppercase letter", regex: /[A-Z]/ },
  { label: "One lowercase letter", regex: /[a-z]/ },
  { label: "One number", regex: /\d/ },
  { label: "One special character", regex: /[^A-Za-z0-9]/ },
];

interface PasswordStrengthChecksProps {
  password: string;
}

export function PasswordStrengthChecks({
  password,
}: PasswordStrengthChecksProps) {
  return (
    <ul className="mt-2 space-y-1">
      {passwordChecks.map((check) => {
        const isValid = check.regex.test(password);
        return (
          <li
            key={check.label}
            className={`flex items-center gap-2 text-xs ${
              isValid ? "text-success" : "text-muted-foreground"
            }`}
          >
            {isValid ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <X className="h-3.5 w-3.5" />
            )}
            {check.label}
          </li>
        );
      })}
    </ul>
  );
}
