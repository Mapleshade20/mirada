export const validateEmail = (email: string): boolean => {
  const allowedDomains = import.meta.env.VITE_ALLOWED_DOMAINS?.split(":") || [
    "mails.tsinghua.edu.cn",
    "stu.pku.edu.cn",
  ];

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }

  // Extract domain from email
  const domain = email.split("@")[1];

  // Check if domain is in allowed list
  return allowedDomains.includes(domain);
};

export const getEmailRateLimit = (): number => {
  return parseInt(import.meta.env.VITE_EMAIL_RATE_LIMIT || "180", 10);
};

export const getTagsLimit = (): number => {
  return parseInt(import.meta.env.VITE_TAGS_LIMIT_SUM || "10", 10);
};

export const getTraitsLimit = (): number => {
  return parseInt(import.meta.env.VITE_TRAITS_LIMIT_EACH || "3", 10);
};

export const getAllowedGrades = (): string[] => {
  return (
    import.meta.env.VITE_ALLOWED_GRADES?.split(":") || [
      "undergraduate",
      "graduate",
    ]
  );
};
