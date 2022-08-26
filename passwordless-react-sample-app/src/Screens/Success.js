
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios'
const Success = () => {
  const navigate= useNavigate()
  const [appData, setAppData] = useState("");

  useEffect(() => {
    const getApplicationNameAndLogo = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/app/viewApp/${process.env.REACT_APP_CLIENT_ID}`
        );
        console.log(response);
        setAppData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getApplicationNameAndLogo();
  }, []);
  const { state: { type, userData, } } = useLocation()
  console.log({ userData, appData })

  return (
    <div className="content">
      <div className="container">
        <div className="row align-items-stretch justify-content-center no-gutters">
          <div className="col-md-7 col-sm-12">
            <div className="card">
              <div className="card-body">
                <div className="row d-flex justify-content-center">
                  <img
                    src="https://www.blue-bricks.com/wp-content/uploads/2021/04/animation_500_knpvibeg.gif"
                    style={{ width: "14rem" }}
                    alt="success-gif"
                  />
                </div>
                <p className="text-center" style={{ fontSize: 20 }}>
                  <b>Done!</b>
                </p>

                {type && type === "Login" ? (
                  <>
                    <p className="text-center">
                      You are successfully Logged in with Passwordless
                    </p>

                    <div className="row justify-content-center mt-3">
                      <div className="col-6 form-group text-center">
                        <a
                          href="/"
                          className="btn btn-lg btn-primary rounded-0 py-2 px-4"
                          style={{ color: "fff" }}
                        >
                          Home
                        </a>
                      </div>
                     {appData?.isSonicKYCEnabled && <div className="col-6 form-group text-center">
                        <button
                        onClick={e=>navigate("/sonic",{state: {userId: userData?.userId, appData }} )}
                          className="btn btn-lg btn-primary rounded-0 py-2 px-4"
                          style={{ color: "fff" }}
                        >
                          SonicKYC
                        </button>
                      </div>}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-center">
                      You are successfully Registered with Passwordless
                    </p>

                    <div className="row justify-content-center mt-3">
                      <div className="col-6 form-group text-center">
                        <a
                          href="/"
                          className="btn btn-lg btn-primary rounded-0 py-2 px-4"
                          style={{ color: "fff" }}
                        >
                          Login
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
