const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // <--- here
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());   

// POST /print endpoint
app.post('/print', (req, res) => {
    const message = req.body.message || 'Empty message';
    
    // Save message to temp file
    const filePath = 'print.txt';
    fs.writeFileSync(filePath, message);

    // Print using Windows Notepad
    exec(`notepad /p ${filePath}`, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Print error: ' + err.message);
        }
        res.send('Print job sent!');
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
