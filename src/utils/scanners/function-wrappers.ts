import {
  SourceFile,
  SyntaxKind,
  Node,
  CallExpression,
  PropertyAccessExpression,
} from "ts-morph";

import { extractEvent } from "../extract";
import { FunctionWrapper } from "../../types";

export function scanFunctionWrappers(
  source: SourceFile,
  wrappers: FunctionWrapper[]
) {
  const events = new Set<string>();

  const calls =
    source.getDescendantsOfKind(
      SyntaxKind.CallExpression
    );

  for (const call of calls) {
    const name =
      getFunctionName(call);

    if (!name) continue;

    for (const wrapper of wrappers) {
      if (wrapper.name !== name)
        continue;

      const event =
        extractEvent(
          call,
          wrapper.path ?? "0"
        );

      if (event)
        events.add(event);
    }
  }

  return events;
}

function getFunctionName(
  call: CallExpression
): string | null {
  const expression =
    call.getExpression();

  // trackFeature()
  if (
    Node.isIdentifier(
      expression
    )
  ) {
    return expression.getText();
  }

  // analytics.trackFeature()
  if (
    Node.isPropertyAccessExpression(
      expression
    )
  ) {
    return getDeepName(
      expression
    );
  }

  return null;
}

function getDeepName(
  node: PropertyAccessExpression
): string {
  let current:
    | Node
    | undefined = node;

  let name = "";

  while (
    Node.isPropertyAccessExpression(
      current
    )
    ) {
    name =
      current.getName();

    current =
      current.getExpression();
  }

  return name;
}
