module.exports = {
    header: function (text, index) {
        return "#".repeat(index)+` ${text}`;
    },

    link: function (url, text) {
        return `[${(text ? text : url)}](${url})`;
    },

    listItem: function (text) {
        return `- ${text}`;
    },

    italic: function (text) {
        return `_${text}_`;
    },

    bold: function (text) {
        return `**${text}**`;
    }
}