const fs = require('fs');

const sourceFileName = "resume.json";

const NL = "\n";
const DEFAULT_LOCALE = "ru";

const i18n = {
    "ru": {
        "location": "Город",
        "birthYear": "Год рождения",
        "skills": "Навыки",
        "experience": "Опыт работы",
        "education": "Образование"
    },
    "en": {
        "location": "Location",
        "birthYear": "Birth",
        "skills": "Skills",
        "experience": "Experience",
        "education": "Education"
    }
}


function heading(text, index) {
    return "#".repeat(index)+` ${text}`;
}

function link(url, text) {
    return `[${text}](${url})`;
}

function listItem(text) {
    return `- ${text}`;
}

function italic(text) {
    return `_${text}_`;
}

function bold(text) {
    return `**${text}**`;
}

function writeFile(fileName, content) {
    fs.writeFile(fileName, content, function (err) {
        if (err) throw err;
        console.log(fileName + " saved.");
      });
}

const json = JSON.parse(fs.readFileSync(sourceFileName, 'utf8'));


// ==================== contacts ====================
const contactsMd = json.contacts.reduce(
    (accum, contact) => {
        const contactValue = contact.url && contact.text ? link(contact.url, contact.text) : (contact.url ? contact.url : contact.text); 
        accum.push(`${contact.type}: ${contactValue}  `);
        return accum;
    }, []).join(NL);
// ==================== end of contacts ====================

json.localization.forEach(loc => {
    const locale = loc.locale;
    const content = loc.content;

    let lines = [];
    lines.push(heading(content.name, 1));
    lines.push(heading(content.title, 2));
    lines.push(contactsMd);
    lines.push(`${i18n[locale].location}: ${content.location}  `);
    lines.push(`${i18n[locale].birthYear}: ${content.birthYear}`);

    lines.push(`${NL}${content.info}${NL}`);
    
    // ==================== skills ====================
    lines.push(heading(i18n[locale].skills, 1));

    const skills = content.skills.reduce(
        (accum, skill) => {
            accum.push(heading(skill.area, 2));

            accum = accum.concat(skill.details.map(detail => listItem(detail)));
            accum.push("");
            return accum;
        }, []).join(NL);

    writeFile(`skills_${locale}.md`, skills);
    
    lines.push(skills);
    // ==================== end of skills ====================

    // ==================== experience ====================
    if(content.experience) {
        lines.push(heading(i18n[locale].experience, 1));

        const experience = content.experience.reduce(
            (accum, exp) => {
                accum.push(italic(exp.period + (exp.type ? ` (${exp.type})` : "")));
                accum.push(bold(exp.company));
                if(exp.url) {
                    accum.push(exp.url);
                }
                if(exp.description) {
                    accum.push(exp.description);
                }
                if(exp.details) {
                    accum = accum.concat(exp.details.map(detail => listItem(detail)));
                }
                accum.push("");

                return accum;
            }, []).join("  "+NL);
        lines.push(experience);
    }
    // ==================== end of experience ====================

    // ==================== education ====================
    if(content.education) {
        lines.push(heading(i18n[locale].education, 1));

        const education = content.education.reduce(
            (accum, edu) => {
                accum.push(italic(edu.period));
                accum.push(bold(edu.name));
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
        if(locale == DEFAULT_LOCALE) {
            fs.copyFile(resumeFileName, "README.md", (err) => {
                if (err) throw err;
                console.log("README.md created.");
              });
        }
      });
});
