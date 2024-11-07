import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "../../assets/styles/react-quill.css";

function RichTextEditor({
  value,
  id,
  onChange,
  readOnly,
}: {
  value: ReactQuill.Value;
  id: string;
  readOnly?: boolean;
  onChange?: (elementValue: any, id: string) => void;
}) {
  return (
    <ReactQuill
      readOnly={readOnly}
      theme="snow"
      value={value}
      onChange={(value) => onChange && onChange(value, id)}
      style={{
        color: "white",
        height: "200px",
        marginBottom: "60px",
      }}
    />
  );
}

export default RichTextEditor;
