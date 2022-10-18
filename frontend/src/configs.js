import configJson from "./auth_config.json";

export const API_SERVER = "http://localhost:3001";
export const MATCHING_SERVICE = "/api/matching";
export const COLLAB_SERVICE = "/api/collab";
export const QUESTION_SERVICE = "/api/question";

export function getConfig() {
  return {
    domain: configJson.domain,
    clientId: configJson.clientId,
    audience: configJson.audience,
    scope: configJson.scope,
  };
}
