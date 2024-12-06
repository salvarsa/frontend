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
      console.log("Respuesta del backend:", data); // Debug para confirmar datos

      if (response.ok) {
        setOutput(data.result.toString() || ""); // Actualiza output
        setConsoleOutput(data.consoleOutput || []); // Actualiza consoleOutput
        setError(""); // Limpia error
      } else {
        setOutput(""); // Limpia output
        setConsoleOutput([]); // Limpia consoleOutput
        setError(data.error || "Error desconocido");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error.message);
      setOutput([]);
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
      color: "#F0DB4F",
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
        <h2>forJS</h2>
        {output && (
          <div>
            <pre className="output">{output}</pre>
          </div>
        )}
        {consoleOutput.length > 0 && (
          <div>
            <strong></strong>
            <pre className="console-output">
              {consoleOutput.map((line, index) => (
                <div key={index} className={`console-${line.type}`}>
                  {line.type.toUpperCase()}:{" "}
                  {line.arguments.map((arg, idx) => (
                    <span key={idx}>
                      {typeof arg === "object"
                        ? JSON.stringify(arg, null, 2)
                        : arg}
                    </span>
                  ))}
                </div>
              ))}
            </pre>
          </div>
        )}

        {/* Renderiza errores */}
        {error && (
          <div>
            <strong>Error:</strong>
            <pre className="error">{error}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
