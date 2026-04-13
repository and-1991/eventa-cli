/* eslint-disable */

declare function track(event: string): void;

const express = (...args: any[]) => ({
  get: (...args: any[]) => {},
  post: (...args: any[]) => {},
  put: (...args: any[]) => {},
  delete: (...args: any[]) => {},
  use: (...args: any[]) => {},
  listen: (...args: any[]) => {}
});

const app = express();

// ===== direct =====
track("express_event");

// ===== middleware =====
app.use(() => {
  track("middleware_event");
});

// ===== get =====
app.get("/", () => {
  track("get_event");
});

// ===== post =====
app.post("/users", () => {
  track("post_event");
});

// ===== put =====
app.put("/users", () => {
  track("put_event");
});

// ===== delete =====
app.delete("/users", () => {
  track("delete_event");
});

// ===== nested =====
app.get("/nested", () => {
  if (true) {
    track("nested_event");
  }
});

// ===== async =====
app.get("/async", async () => {
  track("async_event");
});

// ===== arrow =====
const handler = () => {
  track("arrow_event");
};

app.get("/arrow", handler);

// ===== function =====
function service() {
  track("function_event");
}

// ===== class =====
class Service {
  run() {
    track("class_event");
  }
}

// ===== listen =====
app.listen(3000, () => {
  track("listen_event");
});
