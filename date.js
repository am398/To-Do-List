//jshint esversion:6

module.exports= [getDate, getDay];
function getDate() {
const today = new Date();

const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
};

const day = today.toLocaleDateString("hi-IN", options);
return day;
}

// module.exports.getDay = getDay;
function getDay() {
    let today = new Date();
    
    let options = {
        weekday: 'long',
    };
    
    let day = today.toLocaleDateString("hi-IN", options);
    return day;
    }