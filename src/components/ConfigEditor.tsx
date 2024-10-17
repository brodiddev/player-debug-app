import React, { useState, useEffect } from "react";

interface ConfigEditorProps {
  initialConfig: any;
  onChange: (config: any) => void;
  darkMode: boolean;
}

const ConfigEditor: React.FC<ConfigEditorProps> = ({
  initialConfig,
  onChange,
  darkMode,
}) => {
  const [config, setConfig] = useState(() =>
    JSON.stringify(initialConfig, null, 2)
  );

  useEffect(() => {
    setConfig(JSON.stringify(initialConfig, null, 2));
  }, [initialConfig]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setConfig(value);
    try {
      onChange(JSON.parse(value));
    } catch {
      console.error("Invalid JSON format");
    }
  };

  const textareaClass = `w-full h-64 p-2 border rounded ${
    darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
  }`;

  return (
    <div className="space-y-4">
      <textarea
        className={textareaClass}
        value={config}
        onChange={handleChange}
      />
    </div>
  );
};

export default ConfigEditor;
