// data structure defining various flash messages

var flashMsg = {
    // error messages
    notLoggedIn:        "You need to be logged in to do this",
    campsiteNotFound:   "Campsite not found. You may have gone to an old URL which no longer works",
    commentNotFound:    "Comment not found. You may have gone to an old URL which no longer works",
    campsiteNotAuthorised: "You cannot change this campsite as you did not create it",
    commentNotAuthorised: "You cannot change this comment/review as you did not create it",
    dataError:          "Something went wrong - potentially a database error. Please try again",
    pageNotFound:       "Sorry but the page you are trying to access could not be found",
    wrongAdminPhrase:   "You got the secret admin phrase wrong",
    
    // success messages
    commentCreated:     "Successfully created your comment/review",
    commentUpdated:     "Successfully updated your comment/review",
    commentRemoved:     "Successfully removed your comment/review",
    loginSuccess:       "Welcome back",
    campsiteCreated:    "Successfully created new campsite",
    campsiteUpdated:    "Successfully updated this campsite",
    campsiteRemoved:    "Successfully removed campsite",
    userCreated:        "New User created. Welcome",
    userLoggedOut:      "User logged out. See you later"
}


module.exports = flashMsg;