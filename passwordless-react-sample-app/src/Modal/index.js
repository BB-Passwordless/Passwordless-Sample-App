import Modal from "react-modal";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import classNames from "classnames";

import styles from "./modal.module.css";

const customStyles = {
  content: {
    width: "100%",
    maxWidth: "600px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#F8FFF8",
  },
};

Modal.setAppElement("#root");
const renderTime = (time, dimension) => {
  return (
    <div className="time-wrapper">
      <div className={styles.TextCenter}>{time}</div>
      <div className={styles.TextCenter}>{dimension}</div>
    </div>
  );
};

function App(props) {
 

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

 

  return (
    <div>
      <Modal
        isOpen={props.isVisible}
        onAfterOpen={afterOpenModal}
        onRequestClose={props.closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
          className={styles.row}
        >
          <div className={styles.row}>
            <p className={styles.textCenter}>
              Scan the code below using your Phone's Camera
            </p>
          </div>

          <div
            onClick={() => {
              props.closeModal();
            }}
            style={{
              position: "absolute",
              top: 0,
              right: 15,
              cursor: "pointer",
              width: 2,
              zIndex: 10,
            }}
          >
            &times;
          </div>
          <div
            style={{ justifyContent: "center", alignItems: "center" }}
            className={styles.row}
          >
            <div className={classNames(styles.colLg6, styles.textCenter)}>
              <img src={props.image} style={{ width: "16rem" }} alt="" />
            </div>
            <div
              style={{ flexDirection: "column" }}
              className={classNames(styles.textCenter, styles.colLg6)}
            >
              <p className={styles.textCenter}>QR Code will expire in</p>
              <CountdownCircleTimer
                isPlaying={props.isVisible}
                size={120}
                duration={120}
                onComplete={props.closeModal}
                colors={[
                  ["#004777", 0.33],
                  ["#F7B801", 0.33],
                  ["#A30000", 0.33],
                ]}
              >
                {({ remainingTime }) => renderTime(remainingTime, "Seconds")}
              </CountdownCircleTimer>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;
