let str = "2025/03/15";
str.replaceAll("/","-");
const date = new Date(str);
// date.setMonth(3);

console.log(date);