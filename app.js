
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');    // Importing mongoose
const date = require(__dirname + '/date.js');
const dialog = require('dialog-node');
const _=require('lodash');
const app = express();

mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true });

const itemsSchema = {
    name: String
};


const Item = mongoose.model("Item", itemsSchema);

const shopping = new Item({
    name: "Shopping"
});

const cooking = new Item({
    name: "Cooking"
});

const eating = new Item({
    name: "Eating"
});

const itemarray = [shopping, cooking, eating];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.set('view engine', 'ejs');
let day = date[0]();


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get('/', (req, res) => {

    Item.find().then((foundItems) => {
        if (foundItems.length === 0) {
            Item.insertMany(itemarray);
            res.redirect("/");
        }
        if (foundItems) {
            res.render('list', { Day: day, newListItem: foundItems, List: "Main" });
        }
    });
});

app.get("/About", function (req, res) {
    res.render("about");
});

app.get('/favicon.ico', function (req, res) {
    res.sendStatus(204);
});

app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName);
    // const customListName= str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    console.log(customListName);
    List.findOne({ name: customListName }).then((foundList) => {
        if (foundList === null) {
            dialog.question("Do you want to create a New List with Name: "+customListName+"?", "This List Doesn't Exist!", 0, function (code, retVal, stderr) {
                if (retVal === "OK") {
                    const llist = new List({
                        name: customListName,
                        items: []
                    });
                    llist.save();
                    res.redirect("/" + customListName);

                }
                else {
                    res.redirect("/");
                }
            });
        } else {
            res.render("list", { Day: day, newListItem: foundList.items, List: customListName });
        }
    });


});



app.post("/", function (req, res) {
    var item = req.body.newItem;
    let listName = req.body.List;

    const item1 = new Item({
        name: item
    });

    if (req.body.List === "Main") {
        Item.create(item1);
        res.redirect("/");

    } else {
        List.findOne({ name: listName }).then((foundList) => {
            foundList.items.push(item1);
            foundList.save();
        });
        res.redirect("/" + listName);
    }
});

app.post("/delete", function (req, res) {
    console.log(req.body);
    const checkedItemId = req.body.checkbox;
    const listName = req.body.list;

    if (listName === "Main") {
        dialog.question("Do you want to delete this item?", "Warning", 0, function (code, retVal, stderr) {
            console.log("Return Value: " + retVal);
            console.log("Stderr: " + stderr);
            if (retVal === "OK") {
                Item.findByIdAndRemove(checkedItemId).exec();
                console.log("Item Deleted");
                res.redirect("/");
            }
            else {
                console.log("Item not Deleted");
                res.redirect("/");
            }
        });

    } else {
        dialog.question("Do you want to delete this item?", "Warning", 0, function (code, response, stderr) {
            if (response === "OK") {
                // List.findOne({ name: listName }).then((foundList) => {
                //     console.log(foundList);

                //     for (var i = 0; i < foundList.items.length; i++) {

                //         if (foundList.items[i]._id == checkedItemId){
                //             foundList.items.splice(i, 1);
                //         }
                //     }


                //     foundList.save();

                // });

                List.updateOne({ name: listName }, { $pull: { items: { _id: checkedItemId } } })
                .then((result) => {
                    console.log(result);
                })
                ;
                console.log("Item Deleted");
                res.redirect("/"+listName);
            }
            else {
                console.log("Item not Deleted");
                res.redirect("/"+listName);

            }

        });



    }
    // mongoose.connection.close();
});

app.listen(3000, () => {
    console.log("Server is running on port 3000.");
});