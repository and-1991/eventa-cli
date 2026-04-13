import {
  CallExpression,
  Node,
  ObjectLiteralExpression,
  SyntaxKind,
} from "ts-morph";

export function extractEvent(
  call: CallExpression,
  path: string
): string | null {
  const parts = path.split(".");

  let node: Node | undefined =
    call.getArguments()[Number(parts[0])];

  if (!node) return null;

  node = unwrap(node);

  for (let i = 1; i < parts.length; i++) {
    if (!Node.isObjectLiteralExpression(node)) {
      return null;
    }

    const obj: ObjectLiteralExpression =
      node;

    const prop =
      obj.getProperty(parts[i]);

    if (!prop) return null;

    if (!Node.isPropertyAssignment(prop)) {
      return null;
    }

    const initializer =
      prop.getInitializer();

    if (!initializer) return null;

    node = unwrap(initializer);
  }

  if (Node.isStringLiteral(node)) {
    return node.getLiteralText();
  }

  if (
    node.getKind() ===
    SyntaxKind.NoSubstitutionTemplateLiteral
  ) {
    return node
      .getText()
      .replace(/`/g, "");
  }

  return null;
}

function unwrap(node: Node): Node {
  let current = node;

  while (
    Node.isParenthesizedExpression(
      current
    )
    ) {
    current = current.getExpression();
  }

  return current;
}
