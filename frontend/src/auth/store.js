let access_token = null;

export const setAccessToken = token => (access_token = token);
export const getAccessToken = () => access_token;
export const clearAccessToken = () => (access_token = null);
