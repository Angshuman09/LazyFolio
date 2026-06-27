import { RefObject } from "react";
import { ProfileSchema } from "../schemas/profile";

type SessionData = {
    user?: {
        id?: string | null;
    } | null;
} | null;

export type Props = {
    profile?: ProfileSchema;
    session?: SessionData;
    formRef: RefObject<HTMLFormElement | null>;
    onSubmit: (data: ProfileSchema) => void;
};