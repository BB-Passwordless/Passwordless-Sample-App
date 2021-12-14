
import { useLocation } from "react-router-dom";
const Success = () => {

  const { state: { type } } = useLocation()

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

                {type === "Login" ? (
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
