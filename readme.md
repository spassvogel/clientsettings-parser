## ClientSettings doc parser


Uses doxygen to parse documentation from the ClientSettings.cs file in the B2B backend dotnet project. So you need to have that project cloned on your disk.

### Instructions

First run `npm i` to install dependencies.
Run `node parse.js path/to/B2B.sln` and it will place the output in `output/clientsettings.md`, ready to be copy-pasted to Confluence

### Recommendation

Load this in vscode and add the following `launch.json`. Fill in the path to the .sln file. Then in vscode's 'Run and Debug', choose 'Launch program'

```json
{
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