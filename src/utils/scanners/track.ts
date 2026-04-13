import {
  SourceFile,
  SyntaxKind,
  Node,
  CallExpression,
  PropertyAccessExpression
} from "ts-morph";

import { ExtractedEvent } from "../../types";
import { extractExpression } from "../extract";

export function scanTrack(
  source: SourceFile
) {
  const events =
    new Set<ExtractedEvent>();

  const calls =
    source.getDescendantsOfKind(
      SyntaxKind.CallExpression
    );

  for (const call of calls) {
    const expr =
      call.getExpression();

    let isTrack = false;

    // track()
    if (
      Node.isIdentifier(expr)
    ) {
      isTrack =
        expr.getText() === "track";
    }

    // analytics.track()
    if (
      Node.isPropertyAccessExpression(
        expr
      )
    ) {
      isTrack =
        expr.getName() === "track";
    }

    if (!isTrack) continue;

    const arg =
      call.getArguments()[0];

    if (!arg) continue;

    const result =
      extractExpression(arg);

    if (!result) continue;

    result.values.forEach(
      (value) =>
        events.add({
          value,
          dynamic:
          result.dynamic
        })
    );
  }

  return events;
}
