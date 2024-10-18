import React, { useEffect } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-twilight"; // Dark mode 테마

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
  const [config, setConfig] = React.useState<string>(
    JSON.stringify(initialConfig, null, 2)
  );

  useEffect(() => {
    setConfig(JSON.stringify(initialConfig, null, 2));
  }, [initialConfig]);

  const handleChange = (value: string) => {
    setConfig(value);
    try {
      onChange(JSON.parse(value));
    } catch (error) {
      console.error("Invalid JSON format");
    }
  };

  return (
    <AceEditor
      mode="json"
      theme={darkMode ? "twilight" : "github"}
      value={config}
      onChange={handleChange}
      name="config-editor"
      editorProps={{ $blockScrolling: true }}
      width="100%"
      height="300px"
      setOptions={{
        useWorker: false, // Syntax 에러 처리 비활성화
      }}
    />
  );
};

export default ConfigEditor;
