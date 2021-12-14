import { useEffect, useState } from "react";
import { Passwordless } from "passwordless-bb";

import Modal from "../Modal"
import { getOS } from "../Helper";
import { useNavigate } from "react-router-dom";
const Home = ({ type }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    qr:""
  });
  const [appData, setAppData] = useState({});
  const [showModal, setShowModal] = useState(false);
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

  const closeModal = () => {
    setShowModal(false);
  };

  const saveState = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const registerForm = async (e) => {
    e.preventDefault();

    switch (userData.authMethod) {
      case "1": {
        return Register(userData);
      }

      case "2": {
       return generateDataForQR({ platform: "web", type: 1 });
        
      }

      case "3": {
       return generateDataForQR({ platform: "app", type: 1 });
        
      }

      default: {
       alert("not valid option");
      }
    }
  };

  const loginForm = async (e) => {
    e.preventDefault();

    switch (userData.authMethod) {
      case "1": {
        return login(userData);
      }

      case "2": {
        return generateDataForQR({ platform: "web", type: 2 });
        
      }

      case "3": {
        return generateDataForQR({ platform: "app", type: 2 });
      
      }

      case "4": {
       return generateDataForQR({ platform: "app", type: 2, method: "push" });
        
      }

      default: {
        alert("not valid option");
      }
    }
  };


  const login = async(data) => {
    try {
      const response = await Passwordless.login(data);
      if(response.verified) navigate("/success", { state: { type: "Login" } });
    }
    catch (error) {
      console.log(error)
    }
  }

  const Register = async (data) => {

    try {
       const response = await Passwordless.register(data);
      if (response.verified) navigate("/success",{state:{type:"Register"}})
    }
    catch (error) {
      alert(error)
    }
   
  }

  const generateDataForQR = ({ platform, type, method = "QR" }) => {
    if (!navigator.geolocation)
      throw new Error("Geolocation is not supported by your browser");

    async function success(pos) {
      const { longitude, latitude } = pos.coords;
     
      const data = {
        longitude,
        latitude,
        device: getOS(),
        type,
        platform,
        email: userData.username,
        path: `${window.location.origin}/approve`,
        name: userData.name,
        reqTime: new Date().toLocaleDateString("en-US"),
       
        origin: window.location.origin,
        username:userData.username
      };

      let remoteData = {};
      if (method === "push") {
       remoteData =  await Passwordless.sendPushNotification(data);
      } else {
        remoteData = await Passwordless.generateQR(data);
        console.log("accessToken", remoteData.accessToken);
        setUserData({ ...userData, qr: remoteData.url });
        setShowModal(true);
      }


      const {transactionId} = remoteData;
    
      const transactionstatusResponse =
        await Passwordless.getTransactionStatusOnChange(transactionId);
      closeModal();
      console.log("transactionstatusResponse", transactionstatusResponse);
      if (transactionstatusResponse.status === "SUCCESS") {
        if (type === 1) {
          navigate("/success", { state: { type: "Register" } });
        } else if (type === 2)
          navigate("/success", { state: { type: "Login" } });
      } else if (transactionstatusResponse.status === "FAILED") {
        if (transactionstatusResponse.message)
          alert(transactionstatusResponse.message);
        else alert("Something went wrong");
      } else alert("Something went wrong");
    }

    function error(err) {
      throw new Error(err.message);
    }

    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
    });
  };

  return (
    <>
      <div className="content">
        <div className="container">
          <div className="row align-items-stretch justify-content-center no-gutters">
            <div className="col-md-7 col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="row d-flex justify-content-center">
                    <img
                      src={appData?.logo}
                      id="logo"
                      style={{ width: "18rem", height: "8rem" }}
                      alt="logo"
                    />
                    <div style={{textAlign:"center"}}>
                      <code>{appData?.name}</code>
                    </div>
                  </div>
                  <div className="form h-100 contact-wrap pt-5">
                    <h3 className="text-center">Passwordless {type}</h3>
                    <form
                      className="mb-2 mt-5"
                      method="post"
                      id="contactForm"
                      name="contactForm"
                      onSubmit={type === "Login" ? loginForm : registerForm}
                    >
                      <div className="row">
                        <div className="col-md-12 form-group mb-3">
                          <input
                            type="email"
                            className="form-control"
                            name="username"
                            id="username"
                            placeholder="Username"
                            onChange={saveState}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <select
                          required
                          className="form-select dropdownOption"
                          id="authMethod"
                          name="authMethod"
                          onChange={saveState}
                          aria-label="Default select example"
                          defaultValue="0"
                        >
                          <option value="0">Select Method for {type}</option>
                          <option value="1">Same Platform</option>
                          <option value="2">Appless QR</option>
                          <option value="3">InApp QR</option>
                          {type === "Login" && (
                            <option value="4">Push Notification</option>
                          )}
                        </select>
                      </div>

                      <div className="row justify-content-center mt-3">
                        <div className="col-md-5 form-group text-center">
                          <button
                            className="btn btn-block btn-primary rounded-0 py-2 px-4"
                            style={{ color: "#fff" }}
                            type="submit"
                          >
                            {type}
                          </button>
                        </div>
                      </div>
                    </form>
                    <div style={{ textAlign: "center" }}>
                      {type === "Login" ? (
                        <p>
                          Not registered yet?{" "}
                          <a href="/register" className="blue-color">
                            <b>Register Here</b>
                          </a>
                        </p>
                      ) : (
                        <p>
                          Already registered?{" "}
                          <a href="/" className="blue-color">
                            <b>Login Here</b>
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          isVisible={showModal}
          closeModal={closeModal}
          image={userData.qr}
        />
      </div>
    </>
  );
};

export default Home;
