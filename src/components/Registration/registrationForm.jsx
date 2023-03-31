import Joi from "joi-browser";
import withRouter from "../../services/withRouter";
import Form from "../common/form";
import { getDepartments } from "../../services/municipioDepartamentosService";
import { registerUser } from "../../services/userService";
import { getMunicipalitiesByDepartment } from "../../services/municipioDepartamentosService";
class RegisterForm extends Form {
  state = {
    data: {
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      phone: "",
      department: "",
      municipality: "",
      address: "",
      paymentAccountType: "",
      paymentAccountNumber: "",
    },
    departments: [],

    municipalitiesInDepartment: [],
    errors: {},
    acceptedTermsConditions: false,
  };

  async componentDidMount() {
    const { data } = await getDepartments();
    const departments = data.map((e) => e.departamento);
    this.setState({ departments });
  }

  schema = {
    id: Joi.number().required().label("Cédula"),
    firstName: Joi.string().required().label("Nombres"),
    lastName: Joi.string().required().label("Apellidos"),
    username: Joi.string().required().label("Nombre de usuario"),
    password: Joi.string().required().label("Contraseña"),
    confirmPassword: Joi.string()
      .required()
      .options({
        language: {
          any: {
            allowOnly: "Las contraseñas deben coincidir",
          },
        },
      })
      .label("Confirmar contraseña"),
    email: Joi.string().email().required().label("Correo electrónico"),
    phone: Joi.number().required().label("Teléfono"),
    department: Joi.string()
      .valid(...this.state.departments)
      .required()
      .label("Departamento"),
    municipality: Joi.string().required().label("Municipio"),
    address: Joi.string().required().label("Dirección"),
    paymentAccountType: Joi.string().required().label("Tipo de cuenta de pago"),
    paymentAccountNumber: Joi.string()
      .required()
      .label("Número de cuenta de pago"),
  };

  doSubmit() {}

  handleSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  handleDepartmentSelection = async (departmentName) => {
    // Update the selected department in the state
    const { data } = this.state;
    data["department"] = departmentName;
    this.setState({ data });

    // Now get the municipalities that are in this department. This items will be in the suggestions for the municipality field.
    const { data: municipalities } = await getMunicipalitiesByDepartment(
      departmentName
    );
    this.setState({ municipalitiesInDepartment: municipalities["data"] });
  };

  handleMunicipalitySelection = async (municipalityName) => {
    // Update the selected department in the state
    const { data } = this.state;
    data["municipality"] = municipalityName;
    this.setState({ data });
  };

  render() {
    const { departments, municipalitiesInDepartment } = this.state;
    const municipalitiesNames = municipalitiesInDepartment.map(
      (m) => m["name"]
    );
    return (
      <div>
        <h1>Regístrate</h1>
        <form onSubmit={this.handleSubmit} style={{ display: "flex" }}>
          <div style={{ flex: 1, marginRight: "1em" }}>
            {this.renderInput("id", "Cédula", "number")}
            {this.renderInput("firstName", "Nombres")}
            {this.renderInput("lastName", "Apellidos")}
            {this.renderInput("username", "Nombre de usuario")}
            {this.renderInput("password", "Contraseña", "password")}
            {this.renderInput(
              "confirmPassword",
              "Confirmar Contraseña",
              "password"
            )}
            {this.renderInput("email", "Email", "email")}
          </div>
          <div style={{ flex: 1, marginLeft: "1em" }}>
            {this.renderInput("phone", "Teléfono", "number")}

            {this.renderAutosuggest(
              "department",
              "Departamento",
              departments,
              this.handleDepartmentSelection
            )}

            {this.renderAutosuggest(
              "municipality",
              "Municipio",
              municipalitiesNames,
              this.handleMunicipalitySelection
            )}

            {this.renderInput("address", "Dirección")}
            {this.renderInput("paymentAccountType", "Método de pago")}
            {this.renderInput("paymentAccountNumber", "Número de cuenta")}

            {this.renderTermsConditionsCheckbox()}
            <br />
            {this.renderButton("Save")}
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(RegisterForm);
