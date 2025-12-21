export default function DesignUploader({ onUpload, preview }) {
  return (
    <label>
      <input
        type='file'
        hidden
        accept='image/png'
        onChange={(e) => onUpload(e.target.files[0])}
      />
      {preview ? <img src={preview} width={200} /> : "Upload Design"}
    </label>
  );
}
