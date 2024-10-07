import { AwsProfile } from "../pages/settings";
import { constants } from "./constants";

export const getSelectedProfile = (): AwsProfile | null => {
    const selectedProfileKey = localStorage.getItem(constants.localStorageKey.selectedProfileKey);
    if (!selectedProfileKey) return null;
    const profiles = JSON.parse(localStorage.getItem(constants.localStorageKey.awsProfiles) || '[]');
    return profiles.find((profile: AwsProfile) => profile.key === selectedProfileKey) || null;
};
