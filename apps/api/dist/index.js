"use strict";
// apps/api/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const predict_1 = __importDefault(require("./routes/predict"));
const events_1 = __importDefault(require("./routes/events"));
const timeline_1 = __importDefault(require("./routes/timeline"));
const track_1 = __importDefault(require("./routes/track"));
const checkout_1 = __importDefault(require("./routes/checkout"));
const persona_1 = __importDefault(require("./routes/persona"));
const admin_1 = __importDefault(require("./routes/admin"));
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT || '8080', 10);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/predict', predict_1.default);
app.use('/events', events_1.default);
app.use('/timeline', timeline_1.default);
app.use('/track', track_1.default);
app.use('/checkout', checkout_1.default);
app.use('/persona', persona_1.default);
app.use('/admin', admin_1.default);
app.listen(port, '0.0.0.0', () => {
    console.log(`🔥 EdgeStore API listening on 0.0.0.0:${port}`);
});
