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
export const PathNewsAdminVideo = PathNewsAdminPrefix + '/v';
export const PathNewsAdminVideoLike = PathNewsAdminPrefix + '/v/like';
export const PathNewsAdminVideoStar = PathNewsAdminPrefix + '/v/star';
export const PathNewsAdminVideoLog = PathNewsAdminVideo + '/log';
export const PathNewsAdminVideoLogSlice = PathNewsAdminVideoLog + '/slice';
export const PathNewsAdminVideoLogLike = PathNewsAdminVideo + '/log/like';
export const PathNewsAdminVideoLogStar = PathNewsAdminVideo + '/log/star';

// upload file pathes
export const PathUploadVideoPrefix = PathUploadPrefix + "/v";
export const PathUploadVideoSingle = PathUploadVideoPrefix + "/single";