import { BugFormData } from "../components/forms/BugForm";
import { AuthContextType } from "../types/auth";
import { apiPost, checkStatusAndIgnoreBody } from "./API";
import { BASE_URL } from "./config";

export function reportBug(auth: AuthContextType, data: BugFormData) {
    return apiPost(`${BASE_URL}/bugs`, auth, JSON.stringify(data))
        .then(checkStatusAndIgnoreBody);
}