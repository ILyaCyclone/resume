const fs = require("fs");
const i18n = require("./i18n");
const nunjucks = require("nunjucks");

const sourceFileName = "resume.json";

const DEFAULT_LOCALE = "ru";


function writeFile(fileName, content) {
    fs.writeFile(fileName, content, function (err) {
        if (err) throw err;
        console.log(fileName + " saved.");
      });
}

const source = fs.readFileSync("templates/template.njk", "utf8");
const template = nunjucks.compile(source);


const json = JSON.parse(fs.readFileSync(sourceFileName, 'utf8'));

json.localization.map((loc) => {
    const locale = loc.locale;

    const localI18n = i18n[locale];

    const model = {
        "i18n": localI18n,
        "contacts": json.contacts,
        "content": loc.content
    }

    const result = template.render(model);
    console.log(result);

    const resumeFileName = `resume_${locale}.md`;
    fs.writeFile(resumeFileName, result, function (err) {
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

