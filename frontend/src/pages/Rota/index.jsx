import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, User, Star } from "lucide-react";
import styles from "./Rota.module.css";

import logoSalaCerta from "../../assets/sc1.png";
import logoFlxche from "../../assets/flxche.png";
import { steps } from "../../Repositories/steps";
import { rotas } from "../../Repositories/rotas";
import Loading from "../../components/Loading";
import RouteNotFound from "../../components/RouteNotFound";
import { StatusModal } from "../../components/StatusModal";
import { reviews } from "../../Repositories/reviews";

export function Rota() {
  const navigate = useNavigate();
  const { destinoId } = useParams();

  const [passoAtual, setPassoAtual] = useState(0);
  const [showChegouAlert, setShowChegouAlert] = useState(false);
  const [foundRoom, setFoundRoom] = useState("não");
  const [stepsRoute, setStepsRoute] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [routeExisting, setRouteExisting] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState("");
  const [hover, setHover] = useState(0);
  const [requestStatus, setRequestStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const totalPassos = stepsRoute.length;
  const isUltimoPasso = passoAtual === totalPassos - 1;

  useEffect(() => {
    let timer;
    if (isUltimoPasso) {
      timer = setTimeout(() => {
        setShowChegouAlert(true);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [isUltimoPasso]);

  useEffect(() => {
    async function fetchData() {
      const data = await rotas.listById(destinoId);
      const StepsRoute = await steps.listByArrayIds(data[0].steps);
      setStepsRoute(StepsRoute);
      setIsLoading(false);
      if (StepsRoute.length === 0) setRouteExisting(false);
    }
    fetchData();
  }, []);

  function handleChegouSim() {
    setShowChegouAlert(false);
    setShowFeedbackModal(true);
    setFoundRoom("sim");
  }

  function handleChegouNao() {
    setShowChegouAlert(false);
    setFoundRoom("nao");
    setShowFeedbackModal(true);
    navigate("/busca");
  }

  function handleProximo() {
    if (passoAtual < totalPassos - 1) {
      setPassoAtual(passoAtual + 1);
    }
  }

  function handleAnterior() {
    if (passoAtual > 0) {
      setPassoAtual(passoAtual - 1);
      setShowChegouAlert(false);
    }
  }

  function handleVoltar() {
    navigate(-1);
  }

  async function handleEnviarFeedback() {
    setRequestStatus("loading");
    const data = await reviews.addNewReview({
      feedback: comentario,
      stars: rating,
      foundTheRoom: foundRoom,
    });

    if (!data) {
      setStatusMessage("Ocorreu um erro inesperado!");
      setRequestStatus("error");
      return;
    }
    setRequestStatus("success");
    setShowFeedbackModal(false);
    navigate("/busca");
  }
  const handleCloseStatus = () => {
    setRequestStatus(null);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {!routeExisting ? (
            <RouteNotFound />
          ) : (
            <div className={styles.container}>
              {showChegouAlert && (
                <div className={styles.overlay}>
                  <div className={styles.modal}>
                    <h2 className={styles.modalTitulo}>
                      Você chegou até sua sala (
                      {stepsRoute[totalPassos - 1].description.split(": ")[1]})?
                    </h2>
                    <div className={styles.modalBotoes}>
                      <button
                        className={`${styles.btnModal} ${styles.btnAmarelo}`}
                        onClick={handleChegouSim}
                      >
                        Sim
                      </button>
                      <button
                        className={`${styles.btnModal} ${styles.btnPreto}`}
                        onClick={handleChegouNao}
                      >
                        Não
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {showFeedbackModal && (
                <div className={styles.overlay}>
                  <div className={styles.modal}>
                    <h2 className={styles.modalTitulo}>
                      Como foi sua experiência?
                    </h2>

                    <div className={styles.estrelasContainer}>
                      {[1, 2, 3, 4, 5].map((estrela) => (
                        <button
                          key={estrela}
                          type="button"
                          className={styles.btnEstrela}
                          onClick={() => setRating(estrela)}
                          onMouseEnter={() => setHover(estrela)}
                          onMouseLeave={() => setHover(0)}
                        >
                          <Star
                            size={32}
                            fill={
                              (hover || rating) >= estrela ? "#FFB300" : "none"
                            }
                            color={
                              (hover || rating) >= estrela
                                ? "#FFB300"
                                : "#D9D9D9"
                            }
                          />
                        </button>
                      ))}
                    </div>

                    <textarea
                      className={styles.feedbackInput}
                      placeholder="Diga o que achou do sistema..."
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                    />

                    <div className={styles.modalBotoes}>
                      <button
                        className={`${styles.btnModal} ${styles.btnAmarelo}`}
                        onClick={handleEnviarFeedback}
                        disabled={rating === 0} // Só habilita se der nota
                        style={{
                          opacity: rating === 0 ? 0.5 : 1,
                          width: "100%",
                        }}
                      >
                        Enviar e Finalizar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.header}>
                <button
                  className={styles.btnVoltar}
                  onClick={handleVoltar}
                  aria-label="Voltar para a tela anterior"
                >
                  <ChevronLeft size={24} />
                  Voltar
                </button>

                <img
                  src={logoSalaCerta}
                  alt="Logo Sala Certa"
                  className={styles.headerLogo}
                />
              </div>

              <div className={styles.cardContainer}>
                <div className={styles.imageWrapper}>
                  <img
                    src={stepsRoute[passoAtual].image}
                    alt={`Passo ${passoAtual + 1}: ${stepsRoute[passoAtual].description}`}
                    className={styles.imagemPasso}
                  />
                  {passoAtual > 0 && (
                    <button
                      className={`${styles.btnNav} ${styles.btnAnterior}`}
                      onClick={handleAnterior}
                      aria-label="Passo anterior"
                    >
                      <ChevronLeft size={28} />
                    </button>
                  )}

                  {passoAtual < totalPassos - 1 && (
                    <button
                      className={`${styles.btnNav} ${styles.btnProximo}`}
                      onClick={handleProximo}
                      aria-label="Próximo passo"
                    >
                      <ChevronRight size={28} />
                    </button>
                  )}
                </div>

                <div className={styles.instrucaoBox}>
                  <p className={styles.instrucaoTexto}>
                    {stepsRoute[passoAtual].description}
                  </p>
                </div>
              </div>
              <div className={styles.paginacao}>
                {stepsRoute.map((_, index) => (
                  <div
                    key={index}
                    className={`${styles.dot} ${index === passoAtual ? styles.active : ""}`}
                    role="status"
                    aria-current={index === passoAtual ? "step" : undefined}
                  />
                ))}
              </div>

              <img
                src={logoFlxche}
                alt="Flxche"
                className={styles.footerLogo}
              />
            </div>
          )}
        </>
      )}
      {requestStatus && (
        <StatusModal
          status={requestStatus}
          message={statusMessage}
          onClose={handleCloseStatus}
        />
      )}
    </>
  );
}
