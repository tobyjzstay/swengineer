import express from "express";

const router = express.Router();

router.use((_request, response) => {
    response.status(404).json({});
});

module.exports = router;
