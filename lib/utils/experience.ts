import { readDashboardDraft } from "../cache/dashboard-drafts";
import { ExperienceSchema, SingleExperience } from "../schemas/experience";


export type ExperienceProfile = {
    id?: string;
    experiences?: SingleExperience[];
};

export function experiencesFromProfile(experiences: SingleExperience[] = []): ExperienceSchema {
    return {
      experiences: experiences.map((experience) => ({
        id: experience.id || undefined,
        role: experience.role || "",
        companyName: experience.companyName || "",
        description: experience.description || "",
        startdate: experience.startdate || "",
        enddate: experience.enddate || "",
        isenable: experience.isenable ?? true,
      })),
    };
  }

export function getInitialExperiences(profile?: ExperienceProfile): ExperienceSchema {
    return (
      readDashboardDraft<ExperienceSchema>("experience", profile?.id) ||
      experiencesFromProfile(profile?.experiences || [])
    );
  }
