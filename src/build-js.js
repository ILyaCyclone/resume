const fs = require("fs");
const i18n = require("./i18n");
const md = require("./markdown");

const sourceFileName = "resume.json";

const NL = "\n";
const DEFAULT_LOCALE = "ru";


function writeFile(fileName, content) {
    fs.writeFile(fileName, content, function (err) {
        if (err) throw err;
        console.log(fileName + " saved.");
      });
}

const json = JSON.parse(fs.readFileSync(sourceFileName, 'utf8'));


// ==================== contacts ====================
const contacts = json.contacts.reduce(
    (accum, contact) => {
        const contactValue = contact.url && contact.text ? md.link(contact.url, contact.text) : (contact.url ? contact.url : contact.text); 
        accum.push(`${contact.type}: ${contactValue}  `);
        return accum;
    }, []).join(NL);
// ==================== end of contacts ====================

json.localization.forEach((loc) => {
    const locale = loc.locale;
    const content = loc.content;

    let lines = [];
    lines.push(md.header(content.name, 1));
    lines.push(md.header(content.title, 2));
    lines.push(contacts);
    lines.push(`${i18n[locale].location}: ${content.location}  `);
    lines.push(`${i18n[locale].birthYear}: ${content.birthYear}`);

    lines.push(`${NL}${content.info}${NL}`);
    
    // ==================== skills ====================
    lines.push(md.header(i18n[locale].skills, 1));

    const skills = content.skills.reduce(
        (accum, skill) => {
            accum.push(md.header(skill.area, 2));

            accum = accum.concat(skill.details.map((detail) => md.listItem(detail)));
            accum.push("");
            return accum;
        }, []).join(NL);

    writeFile(`skills_${locale}.md`, skills);
    
    lines.push(skills);
    // ==================== end of skills ====================

    // ==================== experience ====================
    if(content.experience) {
        lines.push(md.header(i18n[locale].experience, 1));

        const experience = content.experience.reduce(
            (accum, exp) => {
                accum.push(md.italic(exp.period + (exp.type ? ` (${exp.type})` : "")));
                accum.push(md.bold(exp.company));
                if(exp.url) {
                    accum.push(md.link(exp.url));
                }
                if(exp.description) {
                    accum.push(exp.description);
                }
                if(exp.details) {
                    accum = accum.concat(exp.details.map((detail) => md.listItem(detail)));
                }
                accum.push("");

                return accum;
            }, []).join("  "+NL);
        lines.push(experience);
    }
    // ==================== end of experience ====================

    // ==================== education ====================
    if(content.education) {
        lines.push(md.header(i18n[locale].education, 1));

        const education = content.education.reduce(
            (accum, edu) => {
                accum.push(md.italic(edu.period));
                accum.push(md.bold(edu.name));
                accum.push(`${edu.speciality}, ${edu.level}, ${edu.qualification}  ${NL}`);
                return accum;
            }, []).join("  "+NL);
        lines.push(education);
    }
    // ==================== end of education ====================


    const resumeContent = lines.join(NL);
    console.log(resumeContent);

    const resumeFileName = `resume_${locale}.md`;
    // writeFile(resumeFileName, resumeContent);
    fs.writeFile(resumeFileName, resumeContent, function (err) {
        if (err) throw err;
        console.log(resumeFileName + " saved.");
        if(locale === DEFAULT_LOCALE) {
            fs.copyFile(resumeFileName, "README.md", (err) => {
                if (err) throw err;
                console.log("README.md created.");
              });
        }
      });
});
