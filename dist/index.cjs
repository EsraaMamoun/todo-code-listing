#!/usr/bin/env node
const fs = require("fs");
const glob = require("glob");

function scanProjectForTodos(projectPath, outputFile, fileExtensions) {
  const todoList = [];

  // Recursively find all files in the project
  const patterns = fileExtensions
    .split(",")
    .map((extension) => `**/*.${extension}`);
  const files = glob.sync(patterns, {
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
  console.log(`File written to ${outputFile}`);
}

const [, , projectPath, outputFile, fileExtension] = process.argv;

scanProjectForTodos(projectPath, outputFile, fileExtension);
