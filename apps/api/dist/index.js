"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// edgestore-ai/apps/api/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const predict_1 = __importDefault(require("./routes/predict"));
const track_1 = __importDefault(require("./routes/track"));
const timeline_1 = __importDefault(require("./routes/timeline"));
const events_1 = __importDefault(require("./routes/events"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (_req, res) => {
    res.send('✅ EdgeStore API is alive');
});
app.use('/predict', predict_1.default);
app.use('/track', express_1.default.json(), track_1.default);
app.use('/timeline', express_1.default.json(), timeline_1.default);
app.use('/events', express_1.default.json(), events_1.default);
// 🚀 Start server after all routes are mounted
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`🔥 Listening on port ${port}`);
});
