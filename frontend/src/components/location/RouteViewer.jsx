import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Star, CheckCircle, AlertTriangle } from "lucide-react";
import { reviews } from "../../Repositories/reviews";

export function RouteViewer({ route, stepsRoute, onClose }) {
  const [passoAtual, setPassoAtual] = useState(0);
  const [showChegouAlert, setShowChegouAlert] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [problema, setProblema] = useState("");
  
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

  async function handleEnviarProblema() {
    try {
      await reviews.addNewReview({
        feedback: `[PROBLEMA RELATADO no Passo ${passoAtual + 1}]: ${problema}`,
        stars: 1, 
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
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700", color: "#111" }}>
            Siga o trajeto
          </h3>
          <button onClick={onClose} style={closeBtnStyle}>
            <X size={22} color="#111" />
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
            <button onClick={handleAnterior} style={{...navBtnStyle, left: "16px"}}>
              <ChevronLeft size={28} color="#111" />
            </button>
          )}

          {passoAtual < totalPassos - 1 && (
            <button onClick={handleProximo} style={{...navBtnStyle, right: "16px"}}>
              <ChevronRight size={28} color="#111" />
            </button>
          )}
        </div>

        <div style={infoContainer}>
          <p style={descriptionStyle}>
            <strong style={{ color: "#FFB300", display: "block", marginBottom: "8px", fontSize: "0.95rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Passo {passoAtual + 1}/{totalPassos}</strong>
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
                  backgroundColor: index === passoAtual ? "#FFB300" : "#E0E0E0",
                  transition: "all 0.3s ease"
                }}
              />
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
            <button onClick={() => setShowReportModal(true)} style={reportBtnStyle}>
              <AlertTriangle size={16} /> Relatar problema na rota
            </button>
          </div>
        </div>
      </div>

      {feedbackEnviado && (
        <div style={overlayModals}>
          <div style={modalBox}>
            <CheckCircle size={56} color="#4CAF50" style={{ margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: "1.3rem", fontWeight: "bold", textAlign: "center", color: "#111", margin: 0 }}>
              Obrigado pelo seu feedback!
            </h2>
          </div>
        </div>
      )}

      {showChegouAlert && (
        <div style={overlayModals}>
          <div style={modalBox}>
            <CheckCircle size={56} color="#FFB300" style={{ margin: "0 auto 16px" }} />
            <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", textAlign: "center", marginBottom: "24px", color: "#111", lineHeight: "1.4" }}>
              Você chegou até o destino final?
            </h2>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={handleChegouSim} style={{...btnStyle, backgroundColor: "#FFB300", color: "#111"}}>Sim</button>
              <button onClick={handleChegouNao} style={{...btnStyle, backgroundColor: "#111", color: "#fff"}}>Não</button>
            </div>
          </div>
        </div>
      )}

      {showFeedbackModal && (
        <div style={overlayModals}>
          <div style={modalBox}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", textAlign: "center", marginBottom: "20px", color: "#111" }}>
              Como foi sua experiência?
            </h2>

            <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "24px" }}>
              {[1, 2, 3, 4, 5].map((estrela) => (
                <button
                  key={estrela}
                  onClick={() => setRating(estrela)}
                  onMouseEnter={() => setHover(estrela)}
                  onMouseLeave={() => setHover(0)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}
                >
                  <Star
                    size={40}
                    fill={(hover || rating) >= estrela ? "#FFB300" : "none"}
                    color={(hover || rating) >= estrela ? "#FFB300" : "#E0E0E0"}
                  />
                </button>
              ))}
            </div>

            <textarea
              style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #E0E0E0", marginBottom: "20px", height: "110px", resize: "none", boxSizing: "border-box", fontFamily: "inherit", fontSize: "0.95rem" }}
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
                color: "#111",
                opacity: rating === 0 ? 0.5 : 1,
              }}
            >
              Enviar e Finalizar
            </button>
          </div>
        </div>
      )}

      {showReportModal && (
        <div style={overlayModals}>
          <div style={modalBox}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", margin: 0, color: "#111" }}>
                Relatar Problema
              </h2>
              <button onClick={() => setShowReportModal(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                <X size={24} color="#111" />
              </button>
            </div>

            <p style={{ fontSize: "0.95rem", color: "#666", marginBottom: "20px", lineHeight: "1.5" }}>
              A foto está desatualizada? A instrução está confusa? Descreva o problema para corrigirmos.
            </p>

            <textarea
              style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #E0E0E0", marginBottom: "20px", height: "110px", resize: "none", boxSizing: "border-box", fontFamily: "inherit", fontSize: "0.95rem" }}
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

const fullscreenOverlay = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.85)",
  backdropFilter: "blur(4px)",
  zIndex: 999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0" 
};

const carouselContainer = {
  backgroundColor: "#ffffff",
  width: "100%",
  height: "100dvh", 
  maxWidth: "500px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 24px",
  backgroundColor: "#ffffff",
  zIndex: 10
};

const closeBtnStyle = {
  background: "#f5f5f5",
  border: "none",
  borderRadius: "50%",
  width: "36px", height: "36px",
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer",
  transition: "background 0.2s"
};

const imageWrapper = {
  position: "relative",
  width: "100%",
  flex: 1, 
  backgroundColor: "#111", 
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden"
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block"
};

const placeholderStyle = {
  color: "#888",
  fontSize: "0.95rem"
};

const navBtnStyle = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(2px)",
  border: "none",
  borderRadius: "50%",
  width: "52px", height: "52px",
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer",
  boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
  zIndex: 2,
  transition: "transform 0.2s ease"
};

const infoContainer = {
  padding: "24px",
  backgroundColor: "#ffffff",
  borderTopLeftRadius: "24px",
  borderTopRightRadius: "24px",
  marginTop: "-20px", 
  zIndex: 5,
  boxShadow: "0 -4px 20px rgba(0,0,0,0.06)"
};

const descriptionStyle = {
  fontSize: "1.1rem",
  color: "#222",
  lineHeight: "1.5",
  margin: "0 0 24px 0",
  fontWeight: "500"
};

const paginationStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "6px"
};

const overlayModals = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.75)",
  backdropFilter: "blur(4px)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px"
};

const modalBox = {
  backgroundColor: "#ffffff",
  padding: "32px 24px",
  borderRadius: "24px",
  width: "100%",
  maxWidth: "380px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column"
};

const btnStyle = {
  flex: 1,
  padding: "16px",
  borderRadius: "14px",
  border: "none",
  fontWeight: "700",
  fontSize: "1.05rem",
  cursor: "pointer",
  transition: "all 0.2s ease",
  fontFamily: "inherit"
};

const reportBtnStyle = {
  background: "none",
  border: "none",
  color: "#ff4444",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "0.9rem",
  cursor: "pointer",
  fontWeight: "600",
  padding: "10px 16px",
  borderRadius: "8px",
  transition: "background 0.2s ease"
};