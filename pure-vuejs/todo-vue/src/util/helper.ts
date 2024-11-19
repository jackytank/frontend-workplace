import { SettingType } from "../types/global";
import { sessionKey } from "./constant";

export const initDefaultSettingToSession = () => {
    sessionStorage.setItem(sessionKey.settingOfCommonScreen, JSON.stringify({
        MyUserSetting: {
          StartMonth: 1,
          name: 'myuser',
          private: true
        }
      } as SettingType));
}