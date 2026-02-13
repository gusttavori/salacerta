import React, { useEffect } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import styles from "./StatusModal.module.css";

type Props = {
  status: "loading" | "success" | "error";
  message: string;
  onClose: () => void;
};

export function StatusModal({ status, message, onClose }: Props) {
  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [status, onClose]);

  const config = {
    loading: {
      icon: <Loader2 className={styles.spinner} size={48} />,
      title: "Enviando...",
    },
    success: {
      icon: <CheckCircle2 size={48} color="#28a745" />,
      title: "Sucesso!",
    },
    error: {
      icon: <XCircle size={48} color="#dc3545" />,
      title: "Ops!",
    },
  };

  const current = config[status];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.iconWrapper}>{current.icon}</div>
        <h2 className={styles.titulo}>{current.title}</h2>
        <p className={styles.mensagem}>{message}</p>

        {status === "error" && (
          <button className={styles.btnOk} onClick={onClose}>
            Tentar novamente
          </button>
        )}
      </div>
    </div>
  );
}
