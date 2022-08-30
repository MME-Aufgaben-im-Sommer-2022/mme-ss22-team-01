require("dotenv/config");
const fs = require("fs-extra");
const path = require("path");

// Entferne die aktuelle Version der "gebauten" Anwendung
if (fs.pathExistsSync(process.env.TARGET)) {
  fs.removeSync(process.env.TARGET, { recursive: true });
}

// Erstelle das leere Ausgabeverzeichnis für die neue Version
fs.mkdirsSync(process.env.TARGET);

// Kopiere den statischen Inhalt der Anwendung ins Zielverzeichnis
fs.copySync(process.env.APP, path.join(process.env.TARGET, "/"));