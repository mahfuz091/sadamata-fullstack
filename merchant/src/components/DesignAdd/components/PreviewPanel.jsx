export default function PreviewPanel({
  canvasRef,
  isBackView,
  onFront,
  onBack,
  onBackUpload,
  onRemoveBack,
  hasBackDesign,
}) {
  return (
    <div className='preview-panel'>
      <div className='toggle-buttons'>
        <button onClick={onFront} className={!isBackView ? "active" : ""}>
          Front
        </button>
        <button onClick={onBack} className={isBackView ? "active" : ""}>
          Back
        </button>
      </div>

      <div style={{ position: "relative" }}>
        <canvas ref={canvasRef} />

        {isBackView && hasBackDesign && (
          <button
            onClick={onRemoveBack}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "var(--commerce-base)",
              color: "#fff",
            }}
          >
            ✕
          </button>
        )}

        {isBackView && (
          <input
            type='file'
            accept='image/png'
            hidden
            onChange={(e) => onBackUpload(e.target.files[0])}
          />
        )}
      </div>
    </div>
  );
}
