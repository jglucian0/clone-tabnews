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
            Status: <ServiceStatus />
          </div>
          <div>
            Última atualização: <LastUpdateTime />
          </div>
          <div>
            Versão do PostgreSQL: <PostgresVersion />{" "}
          </div>
          {/* <div>Conexões Máximas: <RetrieveMaxConnextions /></div> */}
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

function PostgresVersion() {
  const { isLoading, data, isOnline } = useStatusData();

  if (isLoading) {
    return <span>Carregando...</span>;
  }

  const version = data?.dependencies?.database?.version;
  const versionText = isOnline && version ? version : "Indisponível";

  return <span>{versionText}</span>;
}
