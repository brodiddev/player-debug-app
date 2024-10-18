import React, { useEffect } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-twilight";

interface ConfigEditorProps {
  initialConfig: any;
  onChange: (config: any) => void;
  darkMode: boolean;
  configPersistenceEnabled: boolean;
  saveConfig: (config: any) => void;
}

const ConfigEditor: React.FC<ConfigEditorProps> = ({
  initialConfig,
  onChange,
  darkMode,
  configPersistenceEnabled,
  saveConfig,
}) => {
  const [config, setConfig] = React.useState<string>(
    JSON.stringify(initialConfig, null, 2)
  );

  useEffect(() => {
    setConfig(JSON.stringify(initialConfig, null, 2));
  }, [initialConfig]);

  useEffect(() => {
    if (configPersistenceEnabled) {
      attemptToSaveConfig();
    }
  }, [configPersistenceEnabled, config]);

  const attemptToSaveConfig = () => {
    try {
      const parsedConfig = JSON.parse(config);
      saveConfig(parsedConfig);
    } catch (error) {
      console.error("Invalid JSON format");
    }
  };

  const handleChange = (value: string) => {
    setConfig(value);
    try {
      const parsedConfig = JSON.parse(value);
      onChange(parsedConfig);

      if (configPersistenceEnabled) {
        saveConfig(parsedConfig);
      }
    } catch (error) {
      console.error("Invalid JSON format");
    }
  };

  return (
    <div className="mx-auto w-1/2">
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
          useWorker: false,
        }}
      />
    </div>
  );
};

export default ConfigEditor;
