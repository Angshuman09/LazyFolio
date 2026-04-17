export type ProfileFormValues = {
  name: string;
  username: string;
  tagline?: string;
  location?: string;
  age?: number;
  email?: string;
  bio?: string;
  avatar?: FileList;
  banner?: FileList;
};


export type LinksFormValues = {
  label?: string | null;
  url?: string | null;
};

type LinkType = "GITHUB" | "INSTAGRAM" | "X" | "LINKEDIN" | "CUSTOM";