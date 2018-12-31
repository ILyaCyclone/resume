const fs = require("fs");

function deleteFile(filename) {
    fs.unlink(filename, (err) => {
        if (err) throw err;
        console.log(filename+" was deleted");
      });
}


["resume", "skills", "experience", "education"].forEach((result) => {
    let pattern = result + "_\\w{2}\.md";
    var files = fs.readdirSync("./").filter(fn => fn.match(pattern)).forEach((resultFile) => deleteFile(resultFile));
})
