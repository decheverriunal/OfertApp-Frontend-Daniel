import Form from "../common/form";
import Joi from "joi-browser";
import withRouter from "../../services/withRouter";
import logo from "../../images/OfertappGrande.png";
import "../../App.css";

class askResetPasswordForm extends Form {
  state = {
    data: {
      user: "",
    },
    errors: {},
  };

  schema = {
    user: Joi.string().required().label("Nombre de usuario o correo"),
  };

  doSubmit = async () => {
    alert("Se intentará recuperar la contaseña, mira tu correo");
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="container">
          <div className="form-div">
            <div className="row align-middle">
              <img className="login-logo pb-2" src={logo} alt="Nope" />
              <div className="offset-1 col-10">
                <h5 className="login-title ps-2">Recuperación de</h5>
                <h5 className="login-title ps-2 pb-3">contraseña</h5>
                {this.renderInput("user", "Nombre de usuario")}
                <div className="row justify-content-center">
                  {this.renderButton("Save")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default withRouter(askResetPasswordForm);