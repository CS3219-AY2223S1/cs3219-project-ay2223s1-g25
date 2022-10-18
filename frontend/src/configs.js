const URI_USER_SVC = process.env.URI_USER_SVC || 'http://localhost:8000'
const URI_MATCHING_SVC = process.env.URI_MATCHING_SVC || 'http://localhost:8002'

const PREFIX_USER_SVC = '/api/user'

export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC
export const URL_MATCHING_SVC = URI_MATCHING_SVC

