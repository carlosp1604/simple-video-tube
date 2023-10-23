
/** Users **/
export const USER_AUTH_REQUIRED = 'user-authentication-required'
export const USER_SERVER_ERROR = 'user-server-error'
export const USER_USER_NOT_FOUND = 'user-user-resource-not-found'
export const USER_TOKEN_NOT_FOUND = 'user-token-resource-not-found'
export const USER_POST_NOT_FOUND = 'user-post-resource-not-found'
export const USER_METHOD = 'user-method-not-allowed'
export const USER_BAD_REQUEST = 'user-bad-request'
export const USER_VALIDATION = 'user-request-validation-exception'
export const USER_EMAIL_ALREADY_REGISTERED = 'user-conflict-email-already-registered'
export const USER_USERNAME_ALREADY_REGISTERED = 'user-conflict-username-already-registered'
export const USER_INVALID_NAME = 'user-unprocessable-entity-invalid-name'
export const USER_INVALID_USERNAME = 'user-unprocessable-entity-invalid-username'
export const USER_INVALID_EMAIL = 'user-unprocessable-entity-invalid-email'
export const USER_INVALID_TOKEN_TYPE = 'user-unprocessable-entity-invalid-email-token-type'
export const USER_INVALID_PASSWORD = 'user-unprocessable-entity-invalid-password'
export const USER_INVALID_VERIFICATION_TOKEN = 'user-unauthorized-invalid-token'
export const USER_CANNOT_SEND_VERIFICATION_EMAIL = 'user-unprocessable-entity-cannot-send-verification-token'
export const USER_TOKEN_ALREADY_ISSUED = 'user-conflict-token-already-issued'
export const USER_FORBIDDEN = 'user-forbidden-resource'

/** Users saved posts **/
export const USER_SAVED_POSTS_POST_ALREADY_ADDED = 'user-saved-posts-post-already-added-conflict'
export const USER_SAVED_POSTS_POST_DOES_NOT_EXISTS_ON_SAVED_POSTS =
  'user-saved-posts-post-does-not-exist-on-saved-posts-conflict'
export const USER_SAVED_POSTS_CANNOT_DELETE_POST_FROM_SAVED_POSTS =
  'user-saved-posts-cannot-delete-post-from-saved-posts-conflict'
