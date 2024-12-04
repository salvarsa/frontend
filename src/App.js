import React, { useState } from "react";
import MonacoEditor from "react-monaco-editor";
import "./App.css";

function App() {
  const [code, setCode] = useState("// Escribe tu código aquí");
  const [output, setOutput] = useState(""); // Cambiado a cadena
  const [consoleOutput, setConsoleOutput] = useState([]); // Nuevo estado para consoleOutput
  const [error, setError] = useState("");

  const executeCode = async () => {
    try {
      const response = await fetch("http://localhost:1312/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      console.log("Respuesta del backend:", data); // Log para depuración
      if (response.ok) {
        setOutput(data.result || ""); // Asigna result al estado de output
        setConsoleOutput(data.consoleOutput || []); // Asigna consoleOutput al estado de consoleOutput
        setError("");
      } else {
        setOutput("");
        setConsoleOutput([]);
        setError(data.error || "Error desconocido");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error.message); // Log para depuración
      setOutput("");
      setConsoleOutput([]);
      setError("Error al conectar con el servidor");
    }
  };

  const options = {
    selectOnLineNumbers: true,
    automaticLayout: true,
    scrollbar: {
      vertical: "visible",
      horizontal: "visible",
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
      useShadows: false,
    },
    minimap: {
      enabled: false,
    },
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
        <h2>Resultados</h2>
        {output && (
          <pre className="output">
            {output}
          </pre>
        )}
        {consoleOutput.length > 0 && (
          <pre className="console-output">
            {consoleOutput.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
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
