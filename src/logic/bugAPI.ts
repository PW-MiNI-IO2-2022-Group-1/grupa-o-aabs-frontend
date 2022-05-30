import { BugFormData } from "../components/forms/BugForm";
import { apiPost, checkStatusAndIgnoreBody } from "./API";
import { BASE_URL } from "./config";

export function reportBug(data: BugFormData) {
    return apiPost(`${BASE_URL}/bugs`, undefined, JSON.stringify(data))
        .then(checkStatusAndIgnoreBody);
}