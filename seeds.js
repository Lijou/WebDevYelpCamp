var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");
    
var data = [
    {
        name: "Cloud's Rest",
        image: "https://farm7.staticflickr.com/6105/6381606819_df560e1a51.jpg",
        description: "Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Pellentesque in ipsum id orci porta dapibus. Proin eget tortor risus."
    },
    {
        name: "Green Plains",
        image: "https://farm8.staticflickr.com/7205/7121863467_eb0aa64193.jpg",
        description: "Cras ultricies ligula sed magna dictum porta. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget tortor risus. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus."
    },
    {
        name: "Lake Slaughter",
        image: "https://farm4.staticflickr.com/3297/3518227895_339a010a78.jpg",
        description: "Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Proin eget tortor risus. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    }
];


function seedDB(){
    //Remove all campgrounds
    Campground.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("removed campgrounds");
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a campground");
                        //create a comment
                        Comment.create({
                            text: "This place is great but I wish there was Internet",
                            author: "Homer"
                        }, function(err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment!");
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;
    
