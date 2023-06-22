
const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const app = express();

app.set('view engine', 'ejs');

let day=date[0]();


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

var items = ['Shopping', 'Cooking', 'Eating'];
var workItems = [];

app.get('/', (req, res) => {
    res.render('list', { Day: day, newListItem: items, List: null });
});
app.get("/work", function (req, res) {
    res.render("list", { Day: date[1](), List: "Work List", newListItem: workItems });
});

app.get("/about", function (req, res) {
    res.render("about");
});


app.post("/", function (req, res) {
    var item = req.body.newItem;

    if (req.body.List === "Work List") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        console.log(req.body);
        items.push(item);
        res.redirect("/");
    }
});

app.post("/work", function (req, res) {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000.");
});