const texteditor = document.getElementById("text-editor");

function detectVaraibles(text) {
  const variableDetectorRegx = /{{ \w+ }}/g;
  const value = text;
  const matches = value.match(variableDetectorRegx);
  if (Array.isArray(matches)) {
    return matches
      .map((match) => {
        if (typeof match === "string") return match.slice(3, match.length - 3);
        return null;
      })
      .filter((match) => match);
  }
  return matches;
}
texteditor.addEventListener("input", function (e) {
  let variables = detectVaraibles(e.target.value);
  console.log("detection: ", variables);
});
