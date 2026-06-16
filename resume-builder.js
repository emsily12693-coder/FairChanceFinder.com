document.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("resumeOutput");
  const download = document.getElementById("downloadResume");
  document.getElementById("generateResume")?.addEventListener("click", () => {
    const val = (id) => document.getElementById(id)?.value || "";
    output.innerHTML = `<h2>${val("resName")}</h2><p>${val("resEmail")} | ${val("resPhone")} | ${val("resLocation")}</p><h3>Summary</h3><p>${val("resSummary")}</p><h3>Experience</h3><p>${val("resExperience")}</p><h3>Skills</h3><p>${val("resSkills")}</p><h3>Education</h3><p>${val("resEducation")}</p>`;
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
