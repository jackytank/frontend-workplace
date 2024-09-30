import { AwsProfile } from "../pages/settings";
import { awsConstants } from "./constants";

export const getSelectedProfile = (): AwsProfile | null => {
    const selectedProfileKey = localStorage.getItem(awsConstants.localStorageKey.selectedProfileKey);
    if (!selectedProfileKey) return null;
    const profiles = JSON.parse(localStorage.getItem(awsConstants.localStorageKey.awsProfiles) || '[]');
    return profiles.find((profile: AwsProfile) => profile.key === selectedProfileKey) || null;
};