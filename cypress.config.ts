import dotenv from "dotenv";
dotenv.config();

import { defineConfig } from "cypress";
import axios from "axios";
import { MongoClient, Db } from "mongodb";
import bcrypt from "bcrypt";
import { hashPassword } from "./cypress/utils/hashPassword";

let client: MongoClient;
let db: Db;

const connectDB = async () => {
  if (!client) {
    client = await MongoClient.connect(process.env.MONGO_URI_TEST || "");
    db = client.db("test2");
  }
};

const setupNodeEvents = async (on) => {
  await connectDB();

  on("task", {
    async addAdmin() {
      const hashedPassword = hashPassword("123456");

      const user = {
        role: "ADMIN",
        name: "Admin User",
        email: "admin-user@example.com",
        password: hashedPassword,
        isVerified: true,
        verificationCode: {
          code: "123456",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      await db.collection("users").insertOne(user);

      return null;
    },

    async disconnectDB() {
      if (client) {
        await client.close();
      }
      return null;
    },

    async createUser({ name, email }) {
      if (!db) {
        throw new Error("DB not connected");
      }
      await db.collection("users").deleteMany({});

      const hashedPassword = hashPassword("123456");

      const oneMinuteAgo = new Date(Date.now() - 60000); // 60000 milliseconds = 1 minute

      const user = {
        role: "USER",
        name: name,
        email: email,
        password: hashedPassword,
        isVerified: true,
        verificationCode: {
          code: "123456",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      await db.collection("users").insertOne(user);

      return null;
    },

    async clearDB() {
      if (!db) {
        throw new Error("DB not connected");
      }
      await db.collection("users").deleteMany({});
      return null;
    },

    async getResetToken() {
      if (!db) {
        throw new Error("DB not connected");
      }

      const user = await db
        .collection("users")
        .findOne({ email: "test-user@example.com" });

      if (!user || !user.passwordResetToken) {
        return null;
      }

      return user.passwordResetToken;
    },

    async login() {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email: "test-user@example.com",
        password: "123456",
      });

      if (response.status !== 200) {
        throw new Error("Failed to log in");
      }

      const { accessToken, refreshToken } = response.data.tokens;

      return { accessToken, refreshToken };
    },

    async "after:run"() {
      if (client) {
        await client.close();
      }
    },
  });
};

export default defineConfig({
  e2e: {
    baseUrl: "http://127.0.0.1:5173",
    setupNodeEvents,
  },
});
