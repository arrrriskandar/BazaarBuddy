import React from "react";
import { Upload } from "antd";

function FilePicker({ onFileSelect, children }) {
  const handleBeforeUpload = (file) => {
    onFileSelect(file);
    return false;
  };

  return (
    <Upload
      showUploadList={false}
      beforeUpload={handleBeforeUpload}
      accept="image/*"
    >
      {children}
    </Upload>
  );
}

export default FilePicker;
