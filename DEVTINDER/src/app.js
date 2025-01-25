const express = require('express');

const app = express();

// app.use((req, res) => {
//     res.send("Hello world!");
// })

app.use('/hello', (req, res) => {
    res.send("in hello route");
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});