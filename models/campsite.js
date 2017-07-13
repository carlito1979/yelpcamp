var mongoose    = require("mongoose");

// Mongodb schema and model setup
var campsiteSchema = new mongoose.Schema({
    name:           String,
    image:          String,
    description:    String,
    price:          String,
    location: {
        description: String,
        lat:        String,
        lng:        String
    },
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Campsite", campsiteSchema);