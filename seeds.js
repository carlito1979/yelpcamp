var mongoose    = require("mongoose"),
    Campsite    = require("./models/campsite"),
    Comment     = require("./models/comments");

var data = [
    {   name: "Cable Bay Campsite", 
            image: "https://happycamping.co.nz/images/card/9d56479593ec877c32e472b99506b32f.jpg", 
            description: "Set in a sheltered bay with stunning coastal surrounds, Cable Bay is a great place for families to relax on the beach, swim, kayak, fish or explore the nearby walking tracks."},
    {   name: "Kapowairua (Spirits Bay)", 
            image: "http://www.doc.govt.nz/thumbs/gallery/global/images/places/northland/spirits-bay-camp-1200.jpg", 
            description: "This is a standard campsite, with lush forests and sandy beaches in close range. Kapowairua is a place to relax, enjoy and explore the great outdoors."},
    {   name: "Maitai Bay", 
            image: "http://www.doc.govt.nz/thumbs/gallery/global/images/places/northland/maitai-bay/maitai-bay-karikari-peninsula-gallery.jpg", 
            description: "This is a scenic campsite in the Kaitaia area, popular with families and boaties. Camp in a sheltered bay with campsites nestled amongst beautiful pohutukawa trees."},
    {   name: "Otamure Bay (Whananaki) ", 
            image: "http://www.doc.govt.nz/thumbs/gallery/pagefiles/158165/otamure-bay-campsite-1200.jpg", 
            description: "Camp in a beach-front setting with large pōhutukawa trees for shade. Relax on the beach or walk along the coast."},
    {   name: "Rarawa Beach", 
            image: "http://www.doc.govt.nz/thumbs/gallery/pagefiles/161285/rarawa-beach-scenic-525.jpg", 
            description: "This is a standard campsite in the Kaitaia area. With a stunning white sandy beach right on your doorstep. Rarawa is your own slice of Far North paradise, so come relax and enjoy."},
    {   name: "Trounson Kauri Park Campground", 
            image: "http://www.doc.govt.nz/pagefiles/5517/trounson-kauri-park-1920.jpg", 
            description: "A serviced campground in the Kauri Coast area. Camp beside a small but beautiful kauri stand. There are many walking tracks nearby."}
];



function seedDB() {
    // remove all campsites
    Campsite.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("removed campsites");
            // add new campsites
            data.forEach(function(seed) {
                Campsite.create(seed, function(err, campsite) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Campsite Added");
                        // add comments
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function(err, comment) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    campsite.comments.push(comment);
                                    campsite.save();
                                    console.log("Created new comment");
                                }
                                
                            });
                    }
                });
            });
        }
    
    });
}

module.exports = seedDB;
