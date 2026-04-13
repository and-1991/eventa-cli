import {
  Node,
  SyntaxKind
} from "ts-morph";

export type ExtractResult = {
  values: string[];
  dynamic: boolean;
};

export function extractExpression(
  expr: Node
): ExtractResult | null {

  // "event"
  if (Node.isStringLiteral(expr)) {
    return {
      values: [expr.getLiteralText()],
      dynamic: false
    };
  }

  // `event`
  if (
    expr.getKind() ===
    SyntaxKind.NoSubstitutionTemplateLiteral
  ) {
    return {
      values: [
        expr
          .getText()
          .replace(/`/g, "")
      ],
      dynamic: false
    };
  }

  // identifier
  if (
    Node.isIdentifier(expr)
  ) {
    return {
      values: [expr.getText()],
      dynamic: true
    };
  }

  // property access (ROUTES.ACCOUNT)
  if (
    Node.isPropertyAccessExpression(expr)
  ) {
    return {
      values: [expr.getText()],
      dynamic: true
    };
  }

  // ternary
  if (
    Node.isConditionalExpression(expr)
  ) {
    const values: string[] = [];

    const whenTrue =
      extractExpression(
        expr.getWhenTrue()
      );

    const whenFalse =
      extractExpression(
        expr.getWhenFalse()
      );

    if (whenTrue)
      values.push(
        ...whenTrue.values
      );

    if (whenFalse)
      values.push(
        ...whenFalse.values
      );

    return {
      values,
      dynamic: true
    };
  }

  // template
  if (
    Node.isTemplateExpression(expr)
  ) {
    return {
      values: [expr.getText()],
      dynamic: true
    };
  }

  // call
  if (
    Node.isCallExpression(expr)
  ) {
    return {
      values: [
        expr
          .getExpression()
          .getText()
      ],
      dynamic: true
    };
  }

  return null;
}
