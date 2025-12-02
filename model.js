import styles from "./status.module.css";

export default function StatusPage() {
  return (
    <div className={styles.container}>
      <div className={styles.statusPanel}>
        <h2
          style={{
            color: "#fff",
            marginBottom: "2rem",
            fontSize: "2rem",
            fontWeight: 700,
          }}
        >
          Banco de Dados
        </h2>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
        >
          <Row label="Status:" value={<Badge text="healthy" />} />
          <Row label="Conexões disponíveis:" value={<Badge text="407" />} />
          <Row label="Conexões abertas:" value={<Badge text="9" />} />
          <Row
            label="Latência:"
            value={<MultiBadges values={["3ms", "1ms", "1ms"]} />}
          />
          <Row label="Versão do PostgreSQL:" value={<Badge text="14.17" />} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <span
        style={{
          color: "#e2e2e2",
          fontSize: "1.15rem",
          fontWeight: 400,
          minWidth: 180,
        }}
      >
        {label}
      </span>
      {value}
    </div>
  );
}

function Badge({ text }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: "100%",
        background: "none",
        color: "#43c067",
        border: "1.5px solid #43c067",
        padding: "0.18em 0.9em",
        borderRadius: "16px",
        fontWeight: 500,
        fontSize: "1.05rem",
        letterSpacing: "0.5px",
        marginRight: "0.5em",
        marginBottom: "0.2em",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}

function MultiBadges({ values }) {
  return (
    <span>
      {values.map((v, i) => (
        <Badge key={i} text={v} />
      ))}
    </span>
  );
}
