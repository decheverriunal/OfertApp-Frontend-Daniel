import Form from "../form";
import Joi from "joi-browser";
import withRouter from "../../../services/withRouter";
import { addOffer } from "../../../services/offerService";
import "../../../App.css";
import "./offer.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

class OfferForm extends Form {
  state = {
    data: {
      amount: 0
    },
    errors: {},
  };

  schema = {
    amount: Joi.number().required().label("Cantidad a ofertar"),
  };

  doSubmit = async () => {
    const { data } = this.state;
    const { publication } = this.props;

    const info = (await addOffer(publication.id, data)).data;
    console.log(info);
    if (info.status === "success") {
        toast.success(
            "Oferta enviada"
        );
    }else {
        toast.error(JSON.stringify(info.error));
    }
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
        <div>
            <form onSubmit={this.handleSubmit} id="offer-form" className="h-100">
                <div className="row">
                    {this.renderInput("amount","Cantidad a ofertar")}
                </div>
                <div className="row align-right pt-3">
                    {this.renderButton("Postular oferta")}
                </div>
            </form>
        </div>
    );
  }
}

export default withRouter(OfferForm);