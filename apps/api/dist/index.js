"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/predict', (req, res) => {
    const input = req.body.input || 'No input received';
    res.json({ result: `Predicted output for: ${input}` });
});
const port = parseInt(process.env.PORT || '8080', 10);
app.listen(port, '0.0.0.0', () => {
    console.log(`🔥 API listening on port ${port}`);
});
