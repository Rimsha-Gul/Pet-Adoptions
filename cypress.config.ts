import { defineConfig } from "cypress";
import axios from "axios";

const setupNodeEvents = (on) => {
  on("task", {
    async "db:clear"() {
      const { data } = await axios.delete("http://localhost:8080/test/clear");
      return data;
    },
    async "db:seed"() {
      const { data } = await axios.post("http://localhost:8080/test/seed");
      return data;
    },
  });
};

export default defineConfig({
  e2e: {
    baseUrl: "http://127.0.0.1:5173",
    setupNodeEvents,
  },
});
