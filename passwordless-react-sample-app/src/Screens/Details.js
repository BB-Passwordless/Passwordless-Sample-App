import { useEffect, useState } from "react";
import { Passwordless } from "passwordless-bb";
import { useParams } from "react-router-dom";
import Axios from "../Axios";
import { useNavigate } from "react-router-dom";
const Details = () => {
  const navigate = useNavigate();
  const { accessToken } = useParams();
  const [data, setData] = useState({
    username: "",
    reqTime: "",
    device: "",
    id: "",
    longitude: "",
    latitude: "",
  });
  const [appData, setAppData] = useState({
    logo: "",
    name: "",
  });
  useEffect(() => {
    const getApplicationNameAndLogo = async () => {
      try {
    const response = await Passwordless.getApplicationNameAndLogo();

        console.log(response);
        setAppData(response);
      } catch (error) {
        console.log(error);
      }
    };

    getApplicationNameAndLogo();
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await Axios.get("/verifyToken/"+accessToken );
        const { type, latitude, longitude } = response.data;
        if (type === 1) response.data.type = "Register";
        else if (type === 2) response.data.type = "Login";

        const src = `https://www.google.com/maps?q=${latitude},${longitude}&zoom=15&output=embed`;
        response.data.src = src;
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (accessToken) verifyToken();
  }, [accessToken]);

  const login = async () => {
    try {
      const response = await Passwordless.login(data);
      if (response.verified) navigate("/success", { state: { type: "Login" } });
    } catch (error) {
      console.log(error);
    }
  };

  const register = async () => {
    try {
      const response = await Passwordless.register(data);
      if (response.verified)
        navigate("/success", { state: { type: "Register" } });
    } catch (error) {
      alert(error);
    }
  };

  const decline = async () => {
    try {
      await Passwordless.declineTransaction(data.id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="content">
      <div className="container">
        <div className="row align-items-stretch justify-content-center no-gutters">
          <div className="col-md-7 col-sm-12">
            <div className="card">
              <div className="card-body">
                <div className="row d-flex justify-content-center">
                  <img
                    src={appData.logo}
                    id="logo"
                    alt="logo"
                    style={{ width: "18rem", height: "8rem" }}
                  />
                  <div style={{ textAlign: "center" }}>
                    <code>{appData?.name}</code>
                  </div>
                </div>
                <div className="form h-100 contact-wrap pt-4">
                  <h3 className="text-center">Passwordless {data.type}</h3>
                  <div className="row mt-4">
                    <div className="col-12">
                      <p className="mb-1">
                        <span className="mr-2">
                          <i className="far fa-clock"></i>
                        </span>
                        <b>Request Time</b>
                      </p>
                      <h6 style={{ fontSize: 14 }}>{data?.reqTime}</h6>
                    </div>
                  </div>
                  <hr className="my-1" />
                  <div className="row">
                    <div className="col-12">
                      <p className="mb-1">
                        <span className="mr-2">
                          <i className="fas fa-tv"></i>
                        </span>
                        <b>Requesting Device</b>
                      </p>
                      <h6 style={{ fontSize: 14 }}>{data?.device}</h6>
                    </div>
                  </div>
                  <hr className="my-1" />
                  <div className="row">
                    <div className="col-12">
                      <p className="mb-1">
                        <span className="mr-2">
                          <i className="fas fa-map-marker-alt"></i>
                        </span>
                        <b>Location</b>
                      </p>
                      <div className="map-responsive">
                        <iframe
                          id="map"
                          src={data.src}
                          width="100%"
                          height="300"
                          frameBorder="0"
                          style={{ boder: 0 }}
                          allowFullScreen
                          title="map"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                  <hr className="my-1" />
                  <div className="row justify-content-center mt-4">
                    <div className="col-6 form-group text-center">
                      <button
                        className="btn btn-block btn-outline-primary rounded-0 py-2 px-4"
                        onClick={decline}
                      >
                        Decline
                      </button>
                    </div>
                    <div className="col-6 form-group text-center">
                      <button
                        className="btn btn-block btn-primary rounded-0 py-2 px-4"
                        style={{ color: "#fff" }}
                        onClick={data.type === "Login" ? login : register}
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
