function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="card" style={{ backgroundColor: "white", maxWidth: "400px" }}>
        <p>{message}</p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onConfirm}>Confirm</button>
          <button className="btn-danger" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
