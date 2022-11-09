import configJson from "./config.json";

export const API_SERVER = configJson.API_URL;
export const MATCHING_SERVICE = "/api/matching";
export const COLLAB_SERVICE = "/api/collab";
export const QUESTION_SERVICE = "/api/question";
export const CHAT_SERVICE = "/api/chat";

export function getConfig() {
  return {
    domain: configJson.domain,
    clientId: configJson.clientId,
    audience: configJson.audience,
    scope: configJson.scope,
  };
}
