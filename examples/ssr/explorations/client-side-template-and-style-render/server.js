const express = require("express");

const app = express();
const port = "3000";

app.use(express.static("src"));

app.listen(port, () => {
    console.log("example app listening on port 3000");
});
