
const express = require('express');
const bodyParser = require('body-parser');


const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

var items = ['Buy Food'];
var workItems = [];

const today = new Date();

const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
};

const day = today.toLocaleDateString("hi-IN", options);

app.get('/', (req, res) => {
    res.render('list', { Day: day, newListItem: items, List: null });
});
app.get("/work", function (req, res) {
    res.render("list", { Day: day, List: "Work List", newListItem: workItems });
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