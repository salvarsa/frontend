import React, { useState } from "react";
import MonacoEditor from "react-monaco-editor";
import "./App.css";

function App() {
  const [code, setCode] = useState("// Escribe tu código aquí");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const executeCode = async () => {
    try {
      const response = await fetch("http://localhost:1312/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      if (response.ok) {
        setOutput(data.result);
        setError("");
      } else {
        setOutput(`Error: ${data.error}`);
        setError(data.error);
      }
    } catch (error) {
      setOutput("Error al conectar con el servidor");
      setError("Error al conectar con el servidor");
    }
  };

  const options = {
    selectOnLineNumbers: true,
    automaticLayout: true, // Ajusta el tamaño automáticamente.
    scrollbar: {
      vertical: 'visible',
      horizontal: 'visible',
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
      verticalSliderSize: 8,
      horizontalSliderSize: 8,
      useShadows: false
  },
  minimap: {
      enabled: false,
  }
  };

  return (
    <div className="app-container">
        <div className="editor-container">
            <MonacoEditor
                language="javascript"
                theme="vs-dark"
                value={code}
                options={options}
                onChange={(newCode) => setCode(newCode)}
            />
            <button onClick={executeCode} className="execute-button">
                Ejecutar
            </button>
        </div>
        <div className="console-container">
            <h2>Fuck Off RunJS</h2>
            {output && (
                <pre className="output">
                    <br />
                    {output}
                </pre>
            )}
            {error && (
                <pre className="error">
                    <strong>Error:</strong>
                    <br />
                    {error}
                </pre>
            )}
        </div>
    </div>
);
}

export default App;