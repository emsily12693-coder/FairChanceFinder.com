document.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("resumeOutput");
  const download = document.getElementById("downloadResume");
  document.getElementById("generateResume")?.addEventListener("click", () => {
    const val = (id) => document.getElementById(id)?.value || "";

    output.replaceChildren();

    const addHeading = (tag, text) => {
      const el = document.createElement(tag);
      el.textContent = text;
      output.appendChild(el);
    };

    const addParagraph = (text) => {
      const p = document.createElement("p");
      p.textContent = text;
      output.appendChild(p);
    };

    addHeading("h2", val("resName"));
    addParagraph(`${val("resEmail")} | ${val("resPhone")} | ${val("resLocation")}`);
    addHeading("h3", "Summary");
    addParagraph(val("resSummary"));
    addHeading("h3", "Experience");
    addParagraph(val("resExperience"));
    addHeading("h3", "Skills");
    addParagraph(val("resSkills"));
    addHeading("h3", "Education");
    addParagraph(val("resEducation"));

    download.disabled = false;
  });
  download?.addEventListener("click", () => {
    const blob = new Blob([output.innerText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fairchancefinder-resume.txt";
    a.click();
    URL.revokeObjectURL(url);
  });
});
