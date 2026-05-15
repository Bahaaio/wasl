/**
 * Shared API types for JSDoc typing.
 */

/**
 * @typedef {Object} MediaDto
 * @property {string} id
 * @property {"IMAGE" | "VIDEO" | "GIF"} type
 */

/**
 * @typedef {Object} UserDto
 * @property {number} id
 * @property {string} username
 * @property {string} email
 * @property {string?} about
 * @property {string?} avatarMediaId
 * @property {string?} bannerMediaId
 * @property {string} createdAt
 */

/**
 * @typedef {Object} AuthUser
 * @property {number} id
 * @property {string} username
 * @property {string} email
 * @property {string?} about
 * @property {string?} avatarMediaId
 * @property {string?} bannerMediaId
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} accessToken
 * @property {AuthUser} user
 */

/**
 * @typedef {Object} RegisterRequest
 * @property {string} username
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} LoginRequest
 * @property {string} username
 * @property {string} password
 */

/**
 * @typedef {Object} UpdateCurrentUserRequest
 * @property {string} about
 */

/**
 * @typedef {"UPVOTE" | "DOWNVOTE" | "NONE"} VoteAction
 */

/**
 * @typedef {Object} PostDto
 * @property {number} id
 * @property {string} title
 * @property {string} content
 * @property {string} authorUsername
 * @property {string?} authorAvatarMediaId
 * @property {number} communityId
 * @property {string} communityName
 * @property {MediaDto[]} media
 * @property {VoteAction} vote
 * @property {number} score
 * @property {number} commentCount
 * @property {boolean} deleted
 * @property {string} createdAt
 */

/**
 * @typedef {Object} CommentDto
 * @property {number} id
 * @property {string} content
 * @property {string} authorUsername
 * @property {string?} authorAvatarMediaId
 * @property {number?} parentId
 * @property {number} postId
 * @property {MediaDto?} media
 * @property {VoteAction} vote
 * @property {number} score
 * @property {boolean} hasMoreReplies
 * @property {boolean} deleted
 * @property {string} createdAt
 */

/**
 * @typedef {Object} CommentFeedResponse
 * @property {CommentDto[]} comments
 * @property {{ topLevelComments: number, totalTopLevelComments: number, number: number, hasNext: boolean }} page
 */

/**
 * @typedef {Object} PostCreateRequest
 * @property {string} title
 * @property {string} content
 * @property {number} communityId
 * @property {string[]?} mediaIds
 */

/**
 * @typedef {Object} PostPatchRequest
 * @property {string?} title
 * @property {string?} content
 * @property {string[]?} mediaIds
 */

/**
 * @typedef {Object} CommentCreateRequest
 * @property {string} content
 * @property {number?} parentId
 * @property {string?} mediaId
 */

/**
 * @typedef {Object} CommentPatchRequest
 * @property {string} content
 * @property {string?} mediaId
 */

/**
 * @typedef {Object} MediaUploadResponse
 * @property {string} mediaId
 */

/**
 * @typedef {Object} UploadResponse
 * @property {string} mediaId
 */

export {};
