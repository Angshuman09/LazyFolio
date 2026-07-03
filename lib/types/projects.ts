import { RefObject } from "react";
import { ProjectsSchema } from "../schemas/projects";

export type ProfileProject = {
    id?: string | null;
    title?: string | null;
    description?: string | null;
    githubLink?: string | null;
    projectLink?: string | null;
    techstack?: string[] | null;
    enddate?: string | Date | null;
    isenable?: boolean | null;
  };
  
export  type Props = {
    profile?: {
      id?: string;
      projects?: ProfileProject[];
    };
    formRef: RefObject<HTMLFormElement | null>;
    onSubmit?: (data: ProjectsSchema) => void;
  };
