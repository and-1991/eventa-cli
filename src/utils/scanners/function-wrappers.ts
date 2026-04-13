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
        extractEventFromArgs(
          call,
          wrapper.event
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


function extractEventFromArgs(
  call: CallExpression,
  event?: string
): string | null {
  const args = call.getArguments();

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    // string case
    if (!event) {
      if (Node.isStringLiteral(arg)) {
        return arg.getLiteralText();
      }

      // template literal
      if (
        arg.getKind() ===
        SyntaxKind.NoSubstitutionTemplateLiteral
      ) {
        return arg
          .getText()
          .replace(/`/g, "");
      }
    }

    // object case
    if (event) {
      const result =
        extractEvent(
          call,
          `${i}.${event}`
        );

      if (result) return result;
    }
  }

  return null;
}
