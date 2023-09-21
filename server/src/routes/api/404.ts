import express from "express";

const router = express.Router();

router.use((_req, res) => {
    res.status(404).json({ message: randomMessage(_req.originalUrl) });
});

type Message = (path: string) => string;

const messages: Message[] = [
    (path) => "Exception java.lang.NullPointerException at " + path, // Java
    (path) => "Uncaught TypeError: Cannot read properties of null (reading '" + path + "')", // JavaScript
    (path) => "NameError: name '" + path + "' is not defined", // Python
];

function randomMessage(path: string) {
    const index = Math.floor(Math.random() * messages.length);
    return messages[index](path);
}

module.exports = router;
