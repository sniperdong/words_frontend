import { PathPrefix, PathUploadPrefix } from "./const";

// news pathes
export const PathNewsPrefix = PathPrefix + '/news';

export const PathNewsAdminPrefix = PathNewsPrefix + "/m";
export const PathNewsUserPrefix = PathNewsPrefix + "/u";

// news user pathes
export const PathNewsShow = PathNewsUserPrefix + '/list';

// news admin parthes 
export const PathNewsAdminShow = PathNewsAdminPrefix + '/list';
export const PathNewsAdminTotal = PathNewsAdminPrefix + '/total';
export const PathNewsAdminVideoUpPublish = PathNewsAdminPrefix + '/v/up/publish';
export const PathNewsAdminVideoUpMemo = PathNewsAdminPrefix + '/v/up/memo';
export const PathNewsAdminVideoUpContent = PathNewsAdminPrefix + '/v/up/content';


// upload file pathes
export const PathUploadVideoPrefix = PathUploadPrefix + "/v";
export const PathUploadVideoSingle = PathUploadVideoPrefix + "/single";