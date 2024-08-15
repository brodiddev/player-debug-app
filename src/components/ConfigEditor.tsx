import React, { useState, useEffect } from "react";

interface ConfigEditorProps {
  initialConfig: any;
  onChange: (config: any) => void;
}

const ConfigEditor: React.FC<ConfigEditorProps> = ({
  initialConfig,
  onChange,
}) => {
  const [config, setConfig] = useState(JSON.stringify(initialConfig, null, 2));

  useEffect(() => {
    setConfig(JSON.stringify(initialConfig, null, 2));
  }, [initialConfig]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConfig(e.target.value);
    try {
      const parsedConfig = JSON.parse(e.target.value);
      onChange(parsedConfig);
    } catch (error) {
      console.error("Invalid JSON:", error);
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        className="w-full h-64 p-2 border rounded"
        value={config}
        onChange={handleChange}
      />
    </div>
  );
};

export default ConfigEditor;
