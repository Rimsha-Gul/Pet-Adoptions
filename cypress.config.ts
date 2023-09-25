import dotenv from "dotenv";
dotenv.config();

import { defineConfig } from "cypress";
import axios from "axios";
import { MongoClient, Db, ObjectId } from "mongodb";
import { hashPassword } from "./cypress/utils/hashPassword";
import FormData from "form-data";
import fs from "fs";
import { VisitType } from "./src/types/enums";

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

    async createUser({ role, name, email }) {
      if (!db) {
        throw new Error("DB not connected");
      }

      const hashedPassword = hashPassword("123456");

      const user: any = {
        role: role,
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

      if (role === "SHELTER") {
        user.rating = 0;
        user.numberOfReviews = 0;
      }

      await db.collection("users").insertOne(user);

      return null;
    },

    async getAccessToken({ email }) {
      const user = await db.collection("users").findOne({ email: email });

      if (!user) {
        throw new Error("User not found");
      }
      return user.tokens.accessToken;
    },

    async inviteShelter({ shelterEmail, accessToken }) {
      await axios.post(
        `${process.env.API_BASE_URL}/shelter/invite`,
        {
          email: shelterEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return null;
    },

    async getVerificationCode({ email }) {
      const user = await db.collection("users").findOne({ email: email });

      if (!user) {
        throw new Error("User not found");
      }
      console.log(user.verificationCode);
      return { verificationCode: user.verificationCode.code };
    },

    async getInvitationToken({ email }) {
      const invitation = await db
        .collection("invitations")
        .findOne({ shelterEmail: email });

      if (!invitation) {
        throw new Error("Invitation not found");
      }
      console.log("inv t: ", invitation.invitationToken);
      return { invitationToken: invitation.invitationToken };
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

    async login({ email }) {
      const response = await axios.post(
        `${process.env.API_BASE_URL}/auth/login`,
        {
          email: email,
          password: "123456",
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to log in");
      }

      const { accessToken, refreshToken } = response.data.tokens;

      return { accessToken, refreshToken };
    },

    async deleteMany({ collection, params }) {
      const query = await db.collection(collection).deleteMany(params);
      return query;
    },

    async addPet({ accessToken, petData }) {
      const form = new FormData();
      for (const [key, value] of Object.entries(petData)) {
        form.append(key, value);
      }

      const stream = fs.createReadStream(
        "./cypress/fixtures/addingPet/snowball-1.jpg"
      );
      form.append("images", stream);

      const response = await axios.post(
        `${process.env.API_BASE_URL}/pet`,
        form,
        {
          headers: {
            ...form.getHeaders(),
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    },

    async setVisitDateToPast({ applicationID, visitType }) {
      if (!db) {
        throw new Error("DB not connected");
      }

      const application = await db
        .collection("applications")
        .findOne({ _id: new ObjectId(applicationID) });

      if (!application) {
        throw new Error(`Application with ID ${applicationID} not found`);
      }

      const existingVisitDate = new Date(
        visitType === VisitType.Home
          ? application.homeVisitDate
          : application.shelterVisitDate
      );
      existingVisitDate.setDate(existingVisitDate.getDate() - 2);
      const updatedVisitDate = existingVisitDate.toISOString();

      await db.collection("applications").updateOne(
        { _id: new ObjectId(applicationID) },
        {
          $set: {
            [visitType === VisitType.Home
              ? "homeVisitDate"
              : "shelterVisitDate"]: updatedVisitDate,
          },
        }
      );

      const visit = await db.collection("visits").findOne({
        applicationID: new ObjectId(applicationID),
        visitType: visitType,
      });
      if (!visit) {
        throw new Error(`Visit with ID ${applicationID} not found`);
      }

      await db.collection("visits").updateOne(
        {
          applicationID: new ObjectId(applicationID),
          visitType: visitType,
        },
        {
          $set: { visitDate: updatedVisitDate },
        }
      );
      return null;
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
