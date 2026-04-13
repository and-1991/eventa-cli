/* eslint-disable */

declare function track(event: string): void;
declare function trackFeature(event: string): void;

declare const analytics: any;
declare const Button: any;
declare const TrackedButton: any;
declare const MyButton: any;

const eventName = "variable_event";

export default function Page() {
  // ===== direct =====
  track("next_event");

  // ===== multiline =====
  track(
    "multiline_event"
  );

  // ===== template string =====
  track(`template_event`);

  // ===== wrapper function =====
  trackFeature("wrapper_function");

  // ===== object =====
  analytics.track("object_track");

  // ===== nested object =====
  analytics.events.track("nested_track");

  // ===== variable =====
  track(eventName);

  // ===== conditional =====
  if (true) {
    track("conditional_event");
  }

  // ===== ternary =====
  true
    ? track("ternary_a")
    : track("ternary_b");

  // ===== arrow function =====
  const run = () => {
    track("arrow_event");
  };

  // ===== function =====
  function test() {
    track("function_event");
  }

  // ===== class =====
  class Service {
    run() {
      track("class_event");
    }
  }

  return (
    <>
      {/* basic */}
      <Button event="next_button" />

      {/* expression */}
      <Button event={"expression_event"} />

      {/* wrapper component */}
      <TrackedButton event="tracked_button" />

      {/* another wrapper */}
      <MyButton event="my_button" />

      {/* nested */}
      <div>
        <Button event="nested_button" />
      </div>

      {/* conditional */}
      {true && (
        <Button event="conditional_button" />
      )}

      {/* ternary */}
      {true
        ? <Button event="ternary_a_button" />
        : <Button event="ternary_b_button" />
      }

      {/* array */}
      {[
        <Button key="1" event="array_1" />,
        <Button key="2" event="array_2" />
      ]}
    </>
  );
}
