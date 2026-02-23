import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Star, CheckCircle, AlertTriangle } from "lucide-react";
import { reviews } from "../../Repositories/reviews";

export function RouteViewer({ route, stepsRoute, onClose }) {
  const [passoAtual, setPassoAtual] = useState(0);
  const [showChegouAlert, setShowChegouAlert] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false); // Novo estado do modal de problema
  const [problema, setProblema] = useState(""); // Novo estado para o texto do problema
  
  const [foundRoom, setFoundRoom] = useState("não");
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState("");
  const [hover, setHover] = useState(0);
  const [feedbackEnviado, setFeedbackEnviado] = useState(false);

  const totalPassos = stepsRoute?.length || 0;
  const passo = stepsRoute?.[passoAtual];
  const isUltimoPasso = passoAtual === totalPassos - 1 && totalPassos > 0;

  useEffect(() => {
    let timer;
    if (isUltimoPasso && !feedbackEnviado) {
      timer = setTimeout(() => {
        setShowChegouAlert(true);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [isUltimoPasso, feedbackEnviado]);

  if (!route || !stepsRoute || stepsRoute.length === 0) return null;

  function handleProximo() {
    if (passoAtual < totalPassos - 1) setPassoAtual(passoAtual + 1);
  }

  function handleAnterior() {
    if (passoAtual > 0) setPassoAtual(passoAtual - 1);
  }

  function handleChegouSim() {
    setShowChegouAlert(false);
    setFoundRoom("sim");
    setShowFeedbackModal(true);
  }

  function handleChegouNao() {
    setShowChegouAlert(false);
    setFoundRoom("nao");
    setShowFeedbackModal(true);
  }

  async function handleEnviarFeedback() {
    try {
      await reviews.addNewReview({
        feedback: comentario,
        stars: rating,
        foundTheRoom: foundRoom,
      });
      setShowFeedbackModal(false);
      setFeedbackEnviado(true);
      
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      console.error("Erro ao enviar feedback.");
    }
  }

  // NOVO: Função para enviar o relato de problema
  async function handleEnviarProblema() {
    try {
      await reviews.addNewReview({
        feedback: `[PROBLEMA RELATADO no Passo ${passoAtual + 1}]: ${problema}`,
        stars: 1, // Nota baixa para alertar o sistema
        foundTheRoom: "problema",
      });
      setShowReportModal(false);
      setProblema("");
      alert("Problema relatado com sucesso! Nossa equipe vai verificar. Obrigado por ajudar a melhorar o Sala Certa.");
    } catch (err) {
      alert("Erro ao enviar relato de problema.");
    }
  }

  return (
    <div style={fullscreenOverlay}>
      <div style={carouselContainer}>
        <div style={headerStyle}>
          <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#333" }}>
            Siga o trajeto
          </h3>
          <button onClick={onClose} style={closeBtnStyle}>
            <X size={24} color="#333" />
          </button>
        </div>

        <div style={imageWrapper}>
          {passo?.image ? (
            <img
              src={passo.image}
              alt={`Passo ${passoAtual + 1}`}
              style={imageStyle}
              onError={(e) => {
                console.error("Falha ao carregar imagem no link:", e.target.src);
              }}
            />
          ) : (
            <div style={placeholderStyle}>Imagem não disponível</div>
          )}
          
          {passoAtual > 0 && (
            <button onClick={handleAnterior} style={{...navBtnStyle, left: "10px"}}>
              <ChevronLeft size={28} color="#000" />
            </button>
          )}

          {passoAtual < totalPassos - 1 && (
            <button onClick={handleProximo} style={{...navBtnStyle, right: "10px"}}>
              <ChevronRight size={28} color="#000" />
            </button>
          )}
        </div>

        <div style={infoContainer}>
          <p style={descriptionStyle}>
            <strong style={{ color: "#FFB300" }}>Passo {passoAtual + 1}/{totalPassos}:</strong><br/>
            {passo?.description}
          </p>
          
          <div style={paginationStyle}>
            {stepsRoute.map((_, index) => (
              <div
                key={index}
                style={{
                  width: index === passoAtual ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  backgroundColor: index === passoAtual ? "#FFB300" : "#D9D9D9",
                  transition: "all 0.3s ease"
                }}
              />
            ))}
          </div>

          {/* NOVO: Botão de Relatar Problema */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <button onClick={() => setShowReportModal(true)} style={reportBtnStyle}>
              <AlertTriangle size={16} /> Relatar problema na rota
            </button>
          </div>
        </div>
      </div>

      {feedbackEnviado && (
        <div style={overlayModals}>
          <div style={modalBox}>
            <CheckCircle size={48} color="#4CAF50" style={{ margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", textAlign: "center", color: "#333" }}>
              Obrigado pelo seu feedback!
            </h2>
          </div>
        </div>
      )}

      {showChegouAlert && (
        <div style={overlayModals}>
          <div style={modalBox}>
            <CheckCircle size={48} color="#FFB300" style={{ margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", textAlign: "center", marginBottom: "24px", color: "#333" }}>
              Você chegou até o destino final?
            </h2>
            <div style={{ display: "flex", gap: "16px" }}>
              <button onClick={handleChegouSim} style={{...btnStyle, backgroundColor: "#FFB300", color: "#000"}}>Sim</button>
              <button onClick={handleChegouNao} style={{...btnStyle, backgroundColor: "#222", color: "#fff"}}>Não</button>
            </div>
          </div>
        </div>
      )}

      {showFeedbackModal && (
        <div style={overlayModals}>
          <div style={modalBox}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", textAlign: "center", marginBottom: "24px", color: "#333" }}>
              Como foi sua experiência?
            </h2>

            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "24px" }}>
              {[1, 2, 3, 4, 5].map((estrela) => (
                <button
                  key={estrela}
                  onClick={() => setRating(estrela)}
                  onMouseEnter={() => setHover(estrela)}
                  onMouseLeave={() => setHover(0)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                >
                  <Star
                    size={36}
                    fill={(hover || rating) >= estrela ? "#FFB300" : "none"}
                    color={(hover || rating) >= estrela ? "#FFB300" : "#D9D9D9"}
                  />
                </button>
              ))}
            </div>

            <textarea
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "16px", height: "100px", resize: "none", boxSizing: "border-box" }}
              placeholder="Diga o que achou do sistema..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />

            <button
              onClick={handleEnviarFeedback}
              disabled={rating === 0}
              style={{
                ...btnStyle,
                width: "100%",
                backgroundColor: "#FFB300",
                color: "#000",
                opacity: rating === 0 ? 0.5 : 1,
              }}
            >
              Enviar e Finalizar
            </button>
          </div>
        </div>
      )}

      {/* NOVO: MODAL DE RELATAR PROBLEMA */}
      {showReportModal && (
        <div style={overlayModals}>
          <div style={modalBox}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "bold", margin: 0, color: "#333" }}>
                Relatar Problema
              </h2>
              <button onClick={() => setShowReportModal(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={24} color="#333" />
              </button>
            </div>

            <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "16px", lineHeight: "1.4" }}>
              A foto está desatualizada? A instrução está confusa? Descreva o problema para corrigirmos.
            </p>

            <textarea
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "16px", height: "100px", resize: "none", boxSizing: "border-box" }}
              placeholder="Descreva o que há de errado..."
              value={problema}
              onChange={(e) => setProblema(e.target.value)}
            />

            <button
              onClick={handleEnviarProblema}
              disabled={!problema.trim()}
              style={{
                ...btnStyle,
                width: "100%",
                backgroundColor: "#ff4444",
                color: "#fff",
                opacity: !problema.trim() ? 0.5 : 1,
              }}
            >
              Enviar Relatório
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// === ESTILOS CSS INLINE ===
const fullscreenOverlay = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.85)",
  zIndex: 999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "16px"
};

const carouselContainer = {
  backgroundColor: "#fff",
  borderRadius: "20px",
  width: "100%",
  maxWidth: "450px",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 10px 40px rgba(0,0,0,0.4)"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 20px",
  borderBottom: "1px solid #eee"
};

const closeBtnStyle = {
  background: "#f0f0f0",
  border: "none",
  borderRadius: "50%",
  width: "40px", height: "40px",
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer"
};

const imageWrapper = {
  position: "relative",
  width: "100%",
  height: "480px", // MUDANÇA AQUI: de 300px para 480px (Deixa a imagem bem vertical/retrato)
  backgroundColor: "#f0f0f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover", // Garante que a imagem preencha todo o espaço vertical
  display: "block"
};

const placeholderStyle = {
  color: "#999",
  fontSize: "0.9rem"
};

const navBtnStyle = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(255,255,255,0.95)",
  border: "none",
  borderRadius: "50%",
  width: "48px", height: "48px",
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  zIndex: 2
};

const infoContainer = {
  padding: "24px"
};

const descriptionStyle = {
  fontSize: "1.05rem",
  color: "#333",
  lineHeight: "1.6",
  margin: "0 0 24px 0"
};

const paginationStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "8px"
};

const overlayModals = {
  ...fullscreenOverlay,
  zIndex: 1000,
  backgroundColor: "rgba(0,0,0,0.7)",
};

const modalBox = {
  backgroundColor: "#fff",
  padding: "24px",
  borderRadius: "20px",
  width: "90%",
  maxWidth: "360px",
  boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
  display: "flex",
  flexDirection: "column"
};

const btnStyle = {
  flex: 1,
  padding: "16px",
  borderRadius: "12px",
  border: "none",
  fontWeight: "bold",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "all 0.2s"
};

// NOVO ESTILO: Botão de relatar problema
const reportBtnStyle = {
  background: "none",
  border: "none",
  color: "#ff4444",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "0.85rem",
  cursor: "pointer",
  fontWeight: "bold",
  padding: "8px"
};