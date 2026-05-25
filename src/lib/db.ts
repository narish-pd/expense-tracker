import { openDB } from "idb";

export const dbPromise = openDB("expense-tracker", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("transactions")) {
      db.createObjectStore("transactions", {
        keyPath: "id",
      });
    }

    if (!db.objectStoreNames.contains("categories")) {
      db.createObjectStore("categories", {
        keyPath: "id",
      });
    }
  },
});
