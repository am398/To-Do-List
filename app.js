
const express = require('express');
const bodyParser = require('body-parser');


const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

var items = ['Buy Food'];

app.get('/', (req, res) => {


    const today = new Date();

    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };

    const day = today.toLocaleDateString("hi-IN", options);

    // var currentday = today.getDay();
    // var day = '';
    // switch (currentday) {
    //     case 0:
    //         day = "Sunday";
    //         break;
    //     case 1:
    //         day = "Monday";
    //         break;
    //     case 2:
    //         day = "Tuesday";
    //         break;
    //     case 3:
    //         day = "Wednesday";
    //         break;
    //     case 4:
    //         day = "Thrusday";
    //         break;
    //     case 5:
    //         day = "Friday";
    //         break;
    //     case 6:
    //         day = "Saturday";
    //         break;
    //     default:
    //         console.log("Error: current day is equal to: " + currentday);
    // }
    res.render('list', { Day: day, newListItem: items });
});

app.post("/", function (req, res) {
    var item = req.body.newItem;
    console.log(item);
    items.push(item);
    res.redirect("/");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000.");
});