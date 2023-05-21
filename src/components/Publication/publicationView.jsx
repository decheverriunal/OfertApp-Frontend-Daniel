//import Joi from "joi-browser";
import withRouter from "../../services/withRouter";
import { Component } from "react";
import { getPublication } from "../../services/publicationService";
import { postReport } from "../../services/reportService";
import PublicationViewHeader from "./publicationViewHeader";
import PublicationViewMedia from "./publicationViewMedia";
import PublicationViewDescription from "./publicationViewDescription";
import PublicationViewPrice from "./publicationViewPrice";
import PublicationViewOffers from "./publicationViewOffers";
import PublicationViewComments from "./publicationViewComments";
import AdminDeleteButton from "../Admins/deleteButton";

import "./publicationView.css";

import { toast } from "react-toastify";

class PublicationView extends Component {
  state = {
    publication: null,
    userLoggedIn: false,
    reportData: {
      type: "",
      body: "",
    },
  };

  async componentDidMount() {
    try {
      // Getting publication data from server
      const token = localStorage.getItem("token");
      const { data } = await getPublication(this.props.params.id, token);

      // A custom success message will be send by server
      const { status, data: publication } = data;

      if (status === "success") {
        this.setState({
          publication,
          userLoggedIn: token != null,
        });
      } else {
        toast.error("Error al cargar la publicación: Bad Status");
      }
    } catch (ex) {
      console.log(ex);
      toast.error("Error al cargar la publicación");
    }
  }

  handleReportBodyChange = (event) => {
    this.setState({
      reportData: {
        ...this.state.reportData,
        body: event.target.value,
      },
    });
  };

  handleRadioChange = (event) => {
    this.setState({
      reportData: {
        ...this.state.reportData,
        type: event.target.id,
      },
    });
  };

  submitReport = async () => {
    const { type, body } = this.state.reportData;
    const { id } = this.props.params;
    const { data } = await postReport(type, body, id);
    const { status } = data;
    if ( status === "success") {
      toast.success("Reporte enviado con éxito");
    } else {
      toast.error("Error al enviar reporte");
    }
  };

  render() {
    // Getting publication data (which was read as soon this component mounted)
    const { publication } = this.state;
    const { userData } = this.props;

    return (
      <div className="w-100">
        <h1 className="ofertapp-page-title">Visualización de Publicación</h1>

        {
          publication && ! (userData && userData.isAdmin) &&
          <button
            type="button"
            className="btn ofertapp-button-primary"
            data-toggle="modal"
            data-target="#modalReporte"
          >
            Reportar
          </button>
        }
        <div
          className="modal fade"
          id="modalReporte"
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Reportar Subasta
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <h5>Seleccione una o varias infracciones para reportar</h5>
                <ul className="report-list">
                  <li className="report-list__item">
                    <label htmlFor="DF">Producto No Entregado</label>
                    <input
                      type="radio"
                      name="report-type"
                      id="DF"
                      onChange={this.handleRadioChange}
                    />
                  </li>
                  <li className="report-list__item">
                    <label htmlFor="SF">Fraude</label>
                    <input
                      type="radio"
                      name="report-type"
                      id="SF"
                      onChange={this.handleRadioChange}
                    />
                  </li>
                  <li className="report-list__item">
                    <label htmlFor="MA">Publicidad Engañosa</label>
                    <input
                      type="radio"
                      name="report-type"
                      id="MA"
                      onChange={this.handleRadioChange}
                    />
                  </li>

                  <li className="report-list__item">
                    <label htmlFor="MA">Fallo de Calidad</label>
                    <input
                      type="radio"
                      name="report-type"
                      id="QF"
                      onChange={this.handleRadioChange}
                    />
                  </li>

                  <li className="report-list__item">
                    <label htmlFor="DL">No me gustó el producto</label>
                    <input
                      type="radio"
                      name="report-type"
                      id="DL"
                      onChange={this.handleRadioChange}
                    />
                  </li>
                  
                </ul>
                <hr />
                <textarea
                  name="comments"
                  id="comments"
                  cols="30"
                  rows="10"
                  placeholder="Añade un comentario (opcional)"
                  style={{ width: "100%" }}
                  onChange={this.handleReportBodyChange}
                ></textarea>

                <button className="report-button" onClick={this.submitReport}>
                  Reportar
                </button>
              </div>
            </div>
          </div>
        </div>
        {publication && userData && userData.isAdmin && (
          <div>
            <AdminDeleteButton
              type="publicationDelete"
              id={publication.id}
              caption="Eliminar publicación"
              onSuccess={() => {
                toast.success("Publicación eliminada con éxito");
                this.props.navigate("/homepage");
              }}
              onError={(error) => toast.error(error)}
            />
            <div className="row">
              <div className="col-12 col-md-6">
                Tipo de entrega: {
                  publication.deliveryType ? (
                    publication.deliveryType === "SV" ? "Servientrega" : "Prosegur"
                  ) : "No especificado"
                }
              </div>
              <div className="col-12 col-md-6">
                ID de entrega: {
                  publication.deliveryId || "No especificado"
                }
              </div>
            </div>
          </div>  
        )}

        <h2 className="ofertapp-base-subtitle">
          {publication ? (
            <p className="align-middle" style={{ margin: "auto" }}>
              {(publication.priority ? "👑" : "") + publication.title} &nbsp;
              <span className="badge bg-primary ofertapp-category">
                {" "}
                {publication.category.name}{" "}
              </span>
            </p>
          ) : (
            "Cargando..."
          )}
        </h2>

        {
          // Render conditionally further elements if there is a publication
          publication && (
            <div>
              <PublicationViewHeader publication={publication} />
              <div className="row ofertapp-bottomline">
                <div className="col-12 col-md-7 align-middle">
                  <PublicationViewMedia publication={publication} />
                </div>
                <div className="col-12 col-md-4 offset-md-1">
                  <PublicationViewDescription publication={publication} />
                  <PublicationViewPrice publication={publication} />
                </div>
              </div>
              <div className="row ofertapp-bottomline">
                <div className="col-12 col-md-7">
                  <PublicationViewOffers
                    publication={publication}
                    userLoggedIn={this.state.userLoggedIn}
                    userData={userData}
                  />
                </div>
                <div className="col-12 col-md-4 offset-md-1">
                  <PublicationViewComments
                    publication={publication}
                    userLoggedIn={this.state.userLoggedIn}
                    userData={userData}
                  />
                </div>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

export default withRouter(PublicationView);
