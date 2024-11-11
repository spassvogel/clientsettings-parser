## ClientSettings doc parser


Uses doxygen to parse documentation from the ClientSettings.cs file in the B2B backend dotnet project

### Recommendation

Load this in vscode and add the following `launch.json`

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "program": "${workspaceFolder}/parse.js",
      "args": [""] << path to backend here!
    }
  ]
}

```