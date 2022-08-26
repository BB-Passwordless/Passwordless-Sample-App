import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "../Axios";

export default function SonicPage() {
  const navigate = useNavigate();
  const appId = process.env.REACT_APP_CLIENT_ID;
  const [qrCodeImage, setQrCodeImage] = useState("");
  const [error, setError] = useState("")
  const { state: {userId, appData } } = useLocation()

  useEffect(() => {
    if (typeof userId == "string") {
      generateQRCode();
    }
  }, [userId, appData]);
  const generateQRCode = async () => {
    try {
      const res = await Axios.post(`/sonicKYC/generateQrCode`, {
        userId,
        appId,
        ttl: "1d",
      });
      if (res.data.url) {
        setQrCodeImage(res.data.url);
      }
    } catch (error) {
      console.log({error})
    setError(error.response.data.resultMessage)
    }
  };
  console.log({ appData });
  const downloadContainerStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  };
  return (
    <>
      <div className="content">
        <div className="container">
          <div className="row align-items-stretch justify-content-center no-gutters">
            <div className="col-md-8 col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="row d-flex justify-content-center">
                    {appData?.logo && (
                      <img
                        src={appData?.logo}
                        id="logo"
                        style={{
                          width: "5rem",
                          height: "auto",
                          objectFit: "scale-down",
                        }}
                        alt="logo"
                      />
                    )}
                    <div style={{ textAlign: "center" }}>
                      <code>{appData?.name}</code>
                    </div>
                  </div>
                  <div className="form h-100 contact-wrap pt-5">
                    <h3 className="text-center" style={{ fontWeight: "bold" }}>
                      Sonic KYC{" "}
                    </h3>

                    <div style={{ margin: "0 auto", width: "100%" }}>
                      <h4
                        style={{
                          color: "rgb(42, 85, 91)",
                          borderColor: "#0D4990",
                          margin: "0 auto",
                          textAlign: "center",
                          marginBottom: "0.5rem",
                          fontSize: "1rem",
                        }}
                      >
                        Download app from app store and scan the QR code.
                      </h4>
                      <div>
                        <div style={downloadContainerStyle}>
                          <a
                            href="https://play.google.com/store/apps/details?id=com.sonickycv2"
                            target="_blank"
                            rel="noopner noreferrer"
                          >
                            <img
                              src="/static/googlePlaystore.png"
                              alt="googlePlayStore"
                              width="120"
                            />
                          </a>

                          <a
                            href="https://apps.apple.com/us/app/sonickyc/id1572167364"
                            target="_blank"
                            rel="noopner noreferrer"
                          >
                            <img
                              src="/static/appleAppStore.png"
                              alt="appleAppStore"
                              width="120"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                    <p style={{ textAlign: "center" }}>
                      Scan the below QR code from sonic android/ios app
                    </p>
                    <center>
                      {
                        error && <strong style={{color:"red"}}>{error}</strong>
                      }
                      {qrCodeImage && (
                        <img
                          src={qrCodeImage}
                          width="300"
                          height="300"
                          style={{ borderRadius: "10px" }}
                          alt="sonic qr code"
                        />
                      )}
                    </center>

                    <br />
                    <center>
                      <button
                        style={{
                          backgroundColor: "#3f51b5",
                          border: "none",
                          color: "#fff",
                          padding: "0.3rem 0.8rem",
                          borderRadius: "5px",
                        }}
                        onClick={e=>navigate("/")}
                      >
                        Log out
                      </button>
                    </center>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
