/* eslint-disable */

declare function track(event: string): void;

const eventName = "variable_event";

// ===== direct =====
track("node_event");

// ===== multiline =====
track(
  "multiline_event"
);

// ===== template string =====
track(`template_event`);

// ===== conditional =====
if (true) {
  track("conditional_event");
}

// ===== ternary =====
true
  ? track("ternary_a")
  : track("ternary_b");

// ===== variable =====
track(eventName);

// ===== function =====
function run() {
  track("function_event");
}

// ===== arrow =====
const handler = () => {
  track("arrow_event");
};

// ===== class =====
class Service {
  run() {
    track("class_event");
  }
}

// ===== nested =====
function outer() {
  function inner() {
    track("nested_event");
  }
}

// ===== async =====
async function asyncRun() {
  track("async_event");
}

// ===== promise =====
Promise.resolve().then(() => {
  track("promise_event");
});
