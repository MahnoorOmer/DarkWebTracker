var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { users, monitoredKeywords, alerts, threatStats, threatCategories } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
// Database implementation of storage
var DatabaseStorage = /** @class */ (function () {
    function DatabaseStorage() {
    }
    // User operations
    DatabaseStorage.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(users).where(eq(users.id, id))];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUserByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(users).where(eq(users.username, username))];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                }
            });
        });
    };
    DatabaseStorage.prototype.createUser = function (insertUser) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.insert(users).values(insertUser).returning()];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                }
            });
        });
    };
    // Monitored Keywords operations
    DatabaseStorage.prototype.getMonitoredKeywords = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(monitoredKeywords)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getMonitoredKeywordsByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(monitoredKeywords).where(eq(monitoredKeywords.userId, userId))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.createMonitoredKeyword = function (insertKeyword) {
        return __awaiter(this, void 0, void 0, function () {
            var keyword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.insert(monitoredKeywords).values(insertKeyword).returning()];
                    case 1:
                        keyword = (_a.sent())[0];
                        return [2 /*return*/, keyword];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteMonitoredKeyword = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.delete(monitoredKeywords).where(eq(monitoredKeywords.id, id)).returning()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length > 0];
                }
            });
        });
    };
    // Alerts operations
    DatabaseStorage.prototype.getAlerts = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(alerts).orderBy(alerts.createdAt)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getAlert = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(alerts).where(eq(alerts.id, id))];
                    case 1:
                        alert = (_a.sent())[0];
                        return [2 /*return*/, alert];
                }
            });
        });
    };
    DatabaseStorage.prototype.createAlert = function (insertAlert) {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.insert(alerts)
                            .values(__assign(__assign({}, insertAlert), { isRead: false }))
                            .returning()];
                    case 1:
                        alert = (_a.sent())[0];
                        return [2 /*return*/, alert];
                }
            });
        });
    };
    DatabaseStorage.prototype.markAlertAsRead = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.update(alerts)
                            .set({ isRead: true })
                            .where(eq(alerts.id, id))
                            .returning()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length > 0];
                }
            });
        });
    };
    // Threat Stats operations
    DatabaseStorage.prototype.getThreatStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(threatStats)];
                    case 1:
                        stats = (_a.sent())[0];
                        return [2 /*return*/, stats];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateThreatStats = function (insertStats) {
        return __awaiter(this, void 0, void 0, function () {
            var existingStats, updatedStats, newStats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getThreatStats()];
                    case 1:
                        existingStats = _a.sent();
                        if (!existingStats) return [3 /*break*/, 3];
                        return [4 /*yield*/, db.update(threatStats)
                                .set(__assign(__assign({}, insertStats), { lastUpdated: new Date() }))
                                .where(eq(threatStats.id, existingStats.id))
                                .returning()];
                    case 2:
                        updatedStats = (_a.sent())[0];
                        return [2 /*return*/, updatedStats];
                    case 3: return [4 /*yield*/, db.insert(threatStats)
                            .values(__assign(__assign({}, insertStats), { lastUpdated: new Date() }))
                            .returning()];
                    case 4:
                        newStats = (_a.sent())[0];
                        return [2 /*return*/, newStats];
                }
            });
        });
    };
    // Threat Categories operations
    DatabaseStorage.prototype.getThreatCategories = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.select().from(threatCategories)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.createThreatCategory = function (insertCategory) {
        return __awaiter(this, void 0, void 0, function () {
            var category;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db.insert(threatCategories)
                            .values(insertCategory)
                            .returning()];
                    case 1:
                        category = (_a.sent())[0];
                        return [2 /*return*/, category];
                }
            });
        });
    };
    // Initialize sample data for the application
    DatabaseStorage.prototype.initializeData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userCount, user, keywords, _i, keywords_1, keyword, sampleAlerts, _a, sampleAlerts_1, alert_1, categories, _b, categories_1, category;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, db.select({ count: users.id }).from(users)];
                    case 1:
                        userCount = _c.sent();
                        if (userCount.length > 0 && userCount[0].count) {
                            console.log("Database already has data, skipping initialization");
                            return [2 /*return*/];
                        }
                        console.log("Initializing database with sample data");
                        return [4 /*yield*/, db.insert(users).values({
                                username: "analyst",
                                password: "password",
                                role: "analyst"
                            }).returning()];
                    case 2:
                        user = (_c.sent())[0];
                        keywords = [
                            { keyword: "cybercrime", status: "active", frequency: "24h", userId: user.id },
                            { keyword: "data breach", status: "active", frequency: "12h", userId: user.id },
                            { keyword: "credit cards", status: "active", frequency: "7d", userId: user.id },
                            { keyword: "company name", status: "active", frequency: "3d", userId: user.id }
                        ];
                        _i = 0, keywords_1 = keywords;
                        _c.label = 3;
                    case 3:
                        if (!(_i < keywords_1.length)) return [3 /*break*/, 6];
                        keyword = keywords_1[_i];
                        return [4 /*yield*/, db.insert(monitoredKeywords).values(keyword)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        sampleAlerts = [
                            {
                                title: "Credentials Leaked",
                                description: "12 employee credentials found in new data breach dump on dark forum.",
                                type: "credentials",
                                riskLevel: "high"
                            },
                            {
                                title: "Company Mention",
                                description: "Your company was mentioned in a threat actor discussion about potential targets.",
                                type: "mention",
                                riskLevel: "medium"
                            },
                            {
                                title: "Database for Sale",
                                description: "A database allegedly containing customer data is being offered for sale on a marketplace.",
                                type: "database",
                                riskLevel: "critical"
                            },
                            {
                                title: "Executive Mentioned",
                                description: "An executive's name was mentioned in a dark forum related to potential phishing campaigns.",
                                type: "executive",
                                riskLevel: "medium"
                            },
                            {
                                title: "New Intelligence",
                                description: "New threat intelligence report available about emerging ransomware groups targeting your industry.",
                                type: "intelligence",
                                riskLevel: "info"
                            }
                        ];
                        _a = 0, sampleAlerts_1 = sampleAlerts;
                        _c.label = 7;
                    case 7:
                        if (!(_a < sampleAlerts_1.length)) return [3 /*break*/, 10];
                        alert_1 = sampleAlerts_1[_a];
                        return [4 /*yield*/, db.insert(alerts).values(__assign(__assign({}, alert_1), { isRead: false }))];
                    case 8:
                        _c.sent();
                        _c.label = 9;
                    case 9:
                        _a++;
                        return [3 /*break*/, 7];
                    case 10: 
                    // Create threat stats
                    return [4 /*yield*/, db.insert(threatStats).values({
                            activeThreats: 37,
                            dataLeaks: 12,
                            credentialsFound: 128,
                            monitoredKeywords: 24,
                            weeklyChange: {
                                activeThreats: 12,
                                dataLeaks: 3,
                                credentialsFound: 28,
                                monitoredKeywords: 0
                            },
                            lastUpdated: new Date()
                        })];
                    case 11:
                        // Create threat stats
                        _c.sent();
                        categories = [
                            { category: "Data Breaches", percentage: 38, growth: 5, color: "hsl(0, 84.2%, 60.2%)" },
                            { category: "Phishing", percentage: 26, growth: 2, color: "hsl(45, 100%, 51%)" },
                            { category: "Malware", percentage: 18, growth: -3, color: "hsl(207, 90%, 54%)" },
                            { category: "Ransomware", percentage: 12, growth: 34, color: "hsl(151, 100%, 50%)" },
                            { category: "Social Engineering", percentage: 4, growth: 10, color: "hsl(280, 100%, 60%)" },
                            { category: "Other", percentage: 2, growth: 0, color: "hsl(0, 0%, 75%)" }
                        ];
                        _b = 0, categories_1 = categories;
                        _c.label = 12;
                    case 12:
                        if (!(_b < categories_1.length)) return [3 /*break*/, 15];
                        category = categories_1[_b];
                        return [4 /*yield*/, db.insert(threatCategories).values(category)];
                    case 13:
                        _c.sent();
                        _c.label = 14;
                    case 14:
                        _b++;
                        return [3 /*break*/, 12];
                    case 15:
                        console.log("Database initialized successfully");
                        return [2 /*return*/];
                }
            });
        });
    };
    return DatabaseStorage;
}());
export { DatabaseStorage };
export var storage = new DatabaseStorage();
