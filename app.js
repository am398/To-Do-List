
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');    // Importing mongoose
const date = require(__dirname + '/date.js');
const dialog = require('dialog-node');
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


const WorkItem = mongoose.model("WorkItem", itemsSchema);

const Submit = new WorkItem({
    name: "Submit the Project"
});


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
            res.render('list', { Day: day, newListItem: foundItems, List: null });
        }
    });
});


app.get("/work", function (req, res) {
    WorkItem.find().then((Items) => {
        if (Items.length === 0) {
            WorkItem.create(Submit);
            console.log("Items Added in WorkItems");
            res.redirect("/work");
        }
        if (Items) {
            res.render('list', { Day: day, newListItem: Items, List: "Work List" });
        }
    });
});

app.get("/about", function (req, res) {
    res.render("about");
});


app.post("/", function (req, res) {
    var item = req.body.newItem;

    const item1 = new Item({
        name: item
    });
    if (req.body.List === "Work List") {
        WorkItem.create(item1);
        console.log(req.body);
        console.log(WorkItem);
        res.redirect("/work");
    } else {
        Item.create(item1);
        res.redirect("/");
    }
});

app.post("/delete", function (req, res) {
    console.log(req.body);
    const checkedItemId = req.body.checkbox;
    const listName = req.body.list;

    if (listName === "Work List") {
        dialog.question("Do you want to delete this item?", "Warning", 0, function (code, response, stderr) {
            console.log("Return Value: " + response);
            if (response === "OK") {
                WorkItem.findByIdAndRemove(checkedItemId).exec();
    
                console.log("Item Deleted");
                res.redirect("/work");
            }
            else {
                console.log("Item not Deleted");
                res.redirect("/work");
    
            }
    
        });
        
    } else {
        dialog.question("Do you want to delete this item?", "Warning", 0, function (code, retVal, stderr) {
            console.log("Return Value: " + retVal);
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
        

    }
});

// app.post("/work", function (req, res) {
//     let item = req.body.newItem;
//     WorkItem.push(item);
//     res.redirect("/work");
// });

app.listen(3000, () => {
    console.log("Server is running on port 3000.");
});