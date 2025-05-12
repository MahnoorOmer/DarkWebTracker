var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { createServer } from "http";
import { storage } from "./storage";
import { insertMonitoredKeywordSchema, insertAlertSchema } from "@shared/schema";
export function registerRoutes(app) {
    return __awaiter(this, void 0, void 0, function () {
        var apiPrefix, httpServer;
        var _this = this;
        return __generator(this, function (_a) {
            apiPrefix = "/api";
            // Get monitored keywords
            app.get("".concat(apiPrefix, "/keywords"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var keywords, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getMonitoredKeywords()];
                        case 1:
                            keywords = _a.sent();
                            res.json(keywords);
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch monitored keywords" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Create a new monitored keyword
            app.post("".concat(apiPrefix, "/keywords"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var parseResult, newKeyword, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            parseResult = insertMonitoredKeywordSchema.safeParse(req.body);
                            if (!parseResult.success) {
                                return [2 /*return*/, res.status(400).json({ message: "Invalid keyword data", errors: parseResult.error })];
                            }
                            return [4 /*yield*/, storage.createMonitoredKeyword(parseResult.data)];
                        case 1:
                            newKeyword = _a.sent();
                            res.status(201).json(newKeyword);
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            res.status(500).json({ message: "Failed to create monitored keyword" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Delete a monitored keyword
            app.delete("".concat(apiPrefix, "/keywords/:id"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, success, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            id = parseInt(req.params.id);
                            if (isNaN(id)) {
                                return [2 /*return*/, res.status(400).json({ message: "Invalid keyword ID" })];
                            }
                            return [4 /*yield*/, storage.deleteMonitoredKeyword(id)];
                        case 1:
                            success = _a.sent();
                            if (success) {
                                res.json({ message: "Keyword deleted successfully" });
                            }
                            else {
                                res.status(404).json({ message: "Keyword not found" });
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            res.status(500).json({ message: "Failed to delete monitored keyword" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Get all alerts
            app.get("".concat(apiPrefix, "/alerts"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var alerts, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getAlerts()];
                        case 1:
                            alerts = _a.sent();
                            res.json(alerts);
                            return [3 /*break*/, 3];
                        case 2:
                            error_4 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch alerts" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Get a specific alert
            app.get("".concat(apiPrefix, "/alerts/:id"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, alert_1, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            id = parseInt(req.params.id);
                            if (isNaN(id)) {
                                return [2 /*return*/, res.status(400).json({ message: "Invalid alert ID" })];
                            }
                            return [4 /*yield*/, storage.getAlert(id)];
                        case 1:
                            alert_1 = _a.sent();
                            if (alert_1) {
                                res.json(alert_1);
                            }
                            else {
                                res.status(404).json({ message: "Alert not found" });
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_5 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch alert" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Create a new alert
            app.post("".concat(apiPrefix, "/alerts"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var parseResult, newAlert, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            parseResult = insertAlertSchema.safeParse(req.body);
                            if (!parseResult.success) {
                                return [2 /*return*/, res.status(400).json({ message: "Invalid alert data", errors: parseResult.error })];
                            }
                            return [4 /*yield*/, storage.createAlert(parseResult.data)];
                        case 1:
                            newAlert = _a.sent();
                            res.status(201).json(newAlert);
                            return [3 /*break*/, 3];
                        case 2:
                            error_6 = _a.sent();
                            res.status(500).json({ message: "Failed to create alert" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Mark an alert as read
            app.patch("".concat(apiPrefix, "/alerts/:id/read"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var id, success, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            id = parseInt(req.params.id);
                            if (isNaN(id)) {
                                return [2 /*return*/, res.status(400).json({ message: "Invalid alert ID" })];
                            }
                            return [4 /*yield*/, storage.markAlertAsRead(id)];
                        case 1:
                            success = _a.sent();
                            if (success) {
                                res.json({ message: "Alert marked as read" });
                            }
                            else {
                                res.status(404).json({ message: "Alert not found" });
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_7 = _a.sent();
                            res.status(500).json({ message: "Failed to mark alert as read" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Get threat stats
            app.get("".concat(apiPrefix, "/stats"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var stats, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getThreatStats()];
                        case 1:
                            stats = _a.sent();
                            res.json(stats || {});
                            return [3 /*break*/, 3];
                        case 2:
                            error_8 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch threat stats" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Get threat categories
            app.get("".concat(apiPrefix, "/categories"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var categories, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, storage.getThreatCategories()];
                        case 1:
                            categories = _a.sent();
                            res.json(categories);
                            return [3 /*break*/, 3];
                        case 2:
                            error_9 = _a.sent();
                            res.status(500).json({ message: "Failed to fetch threat categories" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            // Search the "dark web" (mock)
            app.post("".concat(apiPrefix, "/search"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, query, networks, contentType, timeRange, riskLevel;
                return __generator(this, function (_b) {
                    try {
                        _a = req.body, query = _a.query, networks = _a.networks, contentType = _a.contentType, timeRange = _a.timeRange, riskLevel = _a.riskLevel;
                        if (!query) {
                            return [2 /*return*/, res.status(400).json({ message: "Search query is required" })];
                        }
                        // Simulating search results
                        // In a real app, this would connect to a dark web scanning service
                        res.json({
                            query: query,
                            results: [],
                            message: "Search functionality implemented. Connect to a real dark web scanning service for actual results."
                        });
                    }
                    catch (error) {
                        res.status(500).json({ message: "Failed to perform search" });
                    }
                    return [2 /*return*/];
                });
            }); });
            httpServer = createServer(app);
            return [2 /*return*/, httpServer];
        });
    });
}
