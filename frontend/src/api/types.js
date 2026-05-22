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
 * @property {string?} about
 * @property {string?} avatarMediaId
 * @property {string?} bannerMediaId
 * @property {string} createdAt
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} accessToken
 * @property {UserDto} user
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
 * @typedef {"top" | "latest" | "hot"} SortOrder
 */

/**
 * @typedef {"all" | "year" | "month" | "week" | "day" | "hour"} SearchTimeFilter
 */

/**
 * @typedef {Object} PostDto
 * @property {number} id
 * @property {string} title
 * @property {string} content
 * @property {string} authorUsername
 * @property {string?} authorAvatarMediaId
 * @property {number} communityMediaId
 * @property {string} communityName
 * @property {MediaDto[]} media
 * @property {VoteAction} vote
 * @property {number} score
 * @property {number} commentCount
 * @property {boolean} deleted
 * @property {string} createdAt
 */

/**
 * @typedef {Object} PagedModelPostDto
 * @property {PostDto[]} content
 * @property {PageMetadata} page
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
 * @property {string} communityName
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

/**
 * @typedef {Object} CommunityCategoryDto
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef {Object} CommunityDto
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {number} categoryId
 * @property {string} categoryName
 * @property {string?} iconMediaId
 * @property {string?} bannerMediaId
 * @property {number} subscribersCount
 * @property {boolean} isPublic
 * @property {string} createdAt
 */

/**
 * @typedef {Object} CommunityCreateRequest
 * @property {string} name
 * @property {string} description
 * @property {number} categoryId
 * @property {boolean} isPublic
 */

/**
 * @typedef {Object} CommunityPatchRequest
 * @property {string?} description
 * @property {number?} categoryId
 * @property {boolean?} isPublic
 */

/**
 * @typedef {"MEMBER" | "MODERATOR" | "OWNER"} CommunityRole
 */

/**
 * @typedef {Object} CommunityMembershipDto
 * @property {number} id
 * @property {number} communityId
 * @property {string} username
 * @property {CommunityRole} role
 * @property {string} createdAt
 */

/**
 * @typedef {Object} PageMetadata
 * @property {number} size
 * @property {number} number
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {Object} PagedModelCommunityMembershipDto
 * @property {CommunityMembershipDto[]} content
 * @property {PageMetadata} page
 */

/**
 * @typedef {Object} PagedModelCommunityDto
 * @property {CommunityDto[]} content
 * @property {PageMetadata} page
 */

/**
 * @typedef {Object} PagedModelUserDto
 * @property {UserDto[]} content
 * @property {PageMetadata} page
 */

/**
 * @typedef {Object} PagedModelPostDto
 * @property {PostDto[]} content
 * @property {PageMetadata} page
 */

/**
 * @typedef {Object} PagedModelCommentDto
 * @property {CommentDto[]} content
 * @property {PageMetadata} page
 */

/**
 * @typedef {Object} PostFeedPage
 * @property {number} size
 * @property {boolean} hasNext
 * @property {string?} nextCursorCreatedAt
 * @property {number?} nextCursorId
 * @property {number?} nextCursorScore
 */

/**
 * @typedef {Object} PostFeedResponse
 * @property {PostDto[]} posts
 * @property {PostFeedPage} page
 */

export {};
