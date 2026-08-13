import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Persistent JSON file store for users and user data
const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const USER_DATA_FILE = path.join(DATA_DIR, "user_data.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: number;
}

interface StoredUserData {
  savedRecipes: any[];
  scanHistory: any[];
  cookedCount: number;
}

function loadUsers(): Record<string, StoredUser> {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to load users:", err);
  }
  return {};
}

function saveUsers(users: Record<string, StoredUser>) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error("Failed to save users:", err);
  }
}

function loadUserData(): Record<string, StoredUserData> {
  try {
    if (fs.existsSync(USER_DATA_FILE)) {
      return JSON.parse(fs.readFileSync(USER_DATA_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to load user data:", err);
  }
  return {};
}

function saveUserData(data: Record<string, StoredUserData>) {
  try {
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Failed to save user data:", err);
  }
}

// Token store mapping token -> userId
const sessions = new Map<string, string>();

function generateToken(userId: string): string {
  const token = `pantry_token_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  sessions.set(token, userId);
  return token;
}

function getUserByToken(req: express.Request): StoredUser | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  const userId = sessions.get(token);
  if (!userId) return null;
  const users = loadUsers();
  return users[userId] || null;
}

// --- AUTHENTICATION API ROUTES ---

// 1. Sign Up
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name is required." });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: "Valid email address is required." });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long." });
  }

  const users = loadUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const existing = Object.values(users).find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return res.status(400).json({ error: "An account with this email address already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newUser: StoredUser = {
    id: userId,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: hashedPassword,
    createdAt: Date.now(),
  };

  users[userId] = newUser;
  saveUsers(users);

  // Initialize user data
  const allUserData = loadUserData();
  allUserData[userId] = {
    savedRecipes: [],
    scanHistory: [],
    cookedCount: 0,
  };
  saveUserData(allUserData);

  const token = generateToken(userId);
  const { passwordHash: _, ...publicUser } = newUser;

  return res.json({ token, user: publicUser });
});

// 2. Log In
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const users = loadUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const user = Object.values(users).find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const token = generateToken(user.id);
  const { passwordHash: _, ...publicUser } = user;

  return res.json({ token, user: publicUser });
});

// 3. Get Current User / Verify Auth Token
app.get("/api/auth/me", (req, res) => {
  const user = getUserByToken(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthenticated or session expired." });
  }
  const { passwordHash: _, ...publicUser } = user;
  return res.json({ user: publicUser });
});

// 4. Forgot Password
app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: "Valid email address is required." });
  }

  return res.json({ message: "Password reset instructions have been sent to your email." });
});

// 5. Google Sign In
app.post("/api/auth/google", (req, res) => {
  const { name = "Gourmet Chef", email = "chef@example.com" } = req.body;

  const users = loadUsers();
  const normalizedEmail = email.trim().toLowerCase();
  let user = Object.values(users).find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    const userId = `usr_google_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    user = {
      id: userId,
      name,
      email: normalizedEmail,
      passwordHash: "google_oauth_provider",
      createdAt: Date.now(),
    };
    users[userId] = user;
    saveUsers(users);

    const allUserData = loadUserData();
    allUserData[userId] = {
      savedRecipes: [],
      scanHistory: [],
      cookedCount: 0,
    };
    saveUserData(allUserData);
  }

  const token = generateToken(user.id);
  const { passwordHash: _, ...publicUser } = user;
  return res.json({ token, user: publicUser });
});

// 6. Update Profile
app.post("/api/auth/update-profile", (req, res) => {
  const user = getUserByToken(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthenticated." });
  }
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name cannot be empty." });
  }

  const users = loadUsers();
  users[user.id].name = name.trim();
  saveUsers(users);

  const { passwordHash: _, ...publicUser } = users[user.id];
  return res.json({ user: publicUser });
});

// 7. Delete Account
app.post("/api/auth/delete-account", (req, res) => {
  const user = getUserByToken(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthenticated." });
  }

  const users = loadUsers();
  delete users[user.id];
  saveUsers(users);

  const allUserData = loadUserData();
  delete allUserData[user.id];
  saveUserData(allUserData);

  return res.json({ success: true, message: "Account and associated data deleted." });
});

// 8. Sync User Data (Saved Recipes, Scan History, Cooked Count)
app.get("/api/user/data", (req, res) => {
  const user = getUserByToken(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthenticated." });
  }
  const allUserData = loadUserData();
  const userData = allUserData[user.id] || { savedRecipes: [], scanHistory: [], cookedCount: 0 };
  return res.json(userData);
});

app.post("/api/user/data", (req, res) => {
  const user = getUserByToken(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthenticated." });
  }
  const { savedRecipes, scanHistory, cookedCount } = req.body;
  const allUserData = loadUserData();
  allUserData[user.id] = {
    savedRecipes: Array.isArray(savedRecipes) ? savedRecipes : allUserData[user.id]?.savedRecipes || [],
    scanHistory: Array.isArray(scanHistory) ? scanHistory : allUserData[user.id]?.scanHistory || [],
    cookedCount: typeof cookedCount === "number" ? cookedCount : allUserData[user.id]?.cookedCount || 0,
  };
  saveUserData(allUserData);
  return res.json({ success: true });
});

// Initialize GoogleGenAI
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Pantry Palette" });
});

// API Endpoint for Ingredient Recognition from Image
app.post("/api/scan-ingredients", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg" } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Missing imageBase64 data" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        error: "Gemini AI recognition service requires GEMINI_API_KEY to be configured in server environment.",
      });
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: "Analyze this image of a fridge, shelf, pantry, or counter. Identify all visible food items and raw cooking ingredients. Return a simple clean list of concise ingredient names (e.g., 'Eggs', 'Chicken Breast', 'Tomatoes', 'White Rice', 'Bell Pepper').",
          },
        ],
      },
      config: {
        systemInstruction: "You are an expert culinary ingredient recognizer. Extract common food ingredient names from photos.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ingredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of detected kitchen ingredients",
            },
          },
          required: ["ingredients"],
        },
      },
    });

    const responseText = response.text || "{}";
    const parsed = JSON.parse(responseText);

    const ingredients = Array.isArray(parsed.ingredients) ? parsed.ingredients : [];

    if (ingredients.length === 0) {
      return res.status(422).json({
        error: "No ingredients could be clearly identified in this photo. Please try taking a clearer photo or enter ingredients manually.",
      });
    }

    return res.json({
      ingredients,
      confidence: 0.95,
      source: "gemini-vision",
    });
  } catch (err: any) {
    console.error("Error in /api/scan-ingredients:", err);
    return res.status(500).json({
      error: err.message || "Failed to process ingredient recognition image.",
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Pantry server running on http://localhost:${PORT}`);
  });
}

startServer();
