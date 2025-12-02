import useSWR from "swr";
import styles from "./status.module.css";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

function useStatusData() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  const isOnline = !!data;

  return { isLoading, data, isOnline };
}

export default function StatusPage() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.statusContainer}>
          <h2>Banco de Dados</h2>
          <div>
            <span>Status:</span>
            <span className={styles.hasBadge}>
              <ServiceStatus />
            </span>
          </div>
          <div>
            <span>Conexões Máximas:</span>
            <span className={styles.hasBadge}>
              <MaxConnections />
            </span>
          </div>
          <div>
            <span>Conexões Abertas:</span>
            <span className={styles.hasBadge}>
              <OpenedConnections />
            </span>
          </div>
          <div>
            <span>Versão do PostgreSQL:</span>
            <span className={styles.hasBadge}>
              <PostgresVersion />
            </span>
          </div>
          <div>
            <span>Última atualização:</span>
            <span className={styles.hasBadge}>
              <LastUpdateTime />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function ServiceStatus() {
  const { isLoading, isOnline } = useStatusData();

  if (isLoading) {
    return <span>Carregando...</span>;
  }

  const statusText = isOnline ? "Online" : "Offline";

  return <span>{statusText}</span>;
}

function MaxConnections() {
  const { isLoading, data, isOnline } = useStatusData();

  if (isLoading) {
    return <span>Carregando...</span>;
  }

  const maxConnections = data?.dependencies?.database?.max_connections;
  const textMaxConnections =
    isOnline && maxConnections ? maxConnections : "Indisponível";

  return <span>{textMaxConnections}</span>;
}

function OpenedConnections() {
  const { isLoading, data, isOnline } = useStatusData();

  if (isLoading) {
    return <span>Carregando...</span>;
  }

  const openedConnections = data?.dependencies?.database?.opened_connections;
  const textOpenedConnections =
    isOnline && openedConnections ? openedConnections : "Indisponnível";

  return <span>{textOpenedConnections}</span>;
}

function PostgresVersion() {
  const { isLoading, data, isOnline } = useStatusData();

  if (isLoading) {
    return <span>Carregando...</span>;
  }

  const version = data?.dependencies?.database?.version;
  const versionText = isOnline && version ? version : "Indisponível";

  return <span>v{versionText}</span>;
}

function LastUpdateTime() {
  const { isLoading, data, isOnline } = useStatusData();

  if (isLoading) {
    return <span>Carregando...</span>;
  }

  const dateString = data?.update_at;
  let textUpdateTime = "Indisponível";

  if (isOnline && dateString) {
    textUpdateTime = new Date(dateString).toLocaleString("pt-BR");
  }

  return <span>{textUpdateTime}</span>;
}
