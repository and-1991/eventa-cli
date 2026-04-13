export function parseVue(
  content: string
) {
  const template =
    content.match(
      /<template[\s\S]*?>([\s\S]*?)<\/template>/
    );

  const script =
    content.match(
      /<script[\s\S]*?>([\s\S]*?)<\/script>/
    );

  return `
${script?.[1] ?? ""}

function __vue_template__() {
  return (
    <>
      ${template?.[1] ?? ""}
    </>
  );
}
`;
}
