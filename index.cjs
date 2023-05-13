const fs = require("fs");
const glob = require("glob");
const http = require("http");

function scanProjectForTodos(projectPath, outputFile, fileExtension) {
  const todoList = [];

  // Recursively find all files in the project
  const files = glob.sync(`**/*.${fileExtension}`, {
    cwd: projectPath,
    ignore: "node_modules/**",
  });

  // Scan each file for TODO comments
  files.forEach((file) => {
    const filePath = `${projectPath}/${file}`;
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const lines = fileContent.split("\n");

    lines.forEach((line, lineNumber) => {
      const todoMatch = line.match(/\/\/\s*TODO(.*)/i);
      if (todoMatch) {
        const todoText = todoMatch[1].trim();
        todoList.push({
          file: file,
          line: lineNumber + 1,
          text: todoText,
        });
      }
    });
  });

  let output = "";
  todoList.forEach((todo) => {
    output += `File: ${todo.file}\n`;
    output += `Line: ${todo.line}\n`;
    output += `TODO: ${todo.text}\n\n`;
  });

  fs.writeFileSync(outputFile, output);
}

const [, , projectPath, outputFile, fileExtension] = process.argv;

scanProjectForTodos(projectPath, outputFile, fileExtension);

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello, world!");
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
