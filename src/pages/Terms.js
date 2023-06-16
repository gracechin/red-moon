import React from "react";
import { Container } from "react-bootstrap";
import NavBar from "../components/NavBar";

function TermsPage() {
  return (
    <div className="wrapper">
      <NavBar />
      <Container className="terms">
        <h1>Privacy, Terms, & Disclaimer</h1>
        <h3>Privacy Policy</h3>
        <p>
          Data entered into the <i>Red Moon</i> web application ("this app") is
          stored only on your browser. No personally identifying data is
          collected from this web application. This app's provider, Grace Chin,
          cannot see, share, or sell your data.
        </p>
        <p>
          Data entered may be exported via this app's export feature, or other
          means. You are responsible for protecting your own data from other
          people acessing your data.{" "}
        </p>
        <h3>Terms of Use / Disclaimer</h3>
        <p>
          <b>This app is not a contraceptive device.</b> It is a data recording
          tool and must be used as such. You may interpret the entered data and
          charts of the entered data however you choose. You are responsible for
          all risks and outcomes that may arise from using this app, such as
          possible pregnancy.
        </p>
        <p>
          <b>The use of this app is entirely at your own risk.</b> You should
          not rely solely on the information provided by this app for any
          purpose, and you should always seek the advice of a qualified
          professional before making any decisions or taking any actions.
          Information provided by this app is not medical advice and it should
          not be treated as such. Your continued use of this app constitutes
          acceptance of any modifications to this app.
        </p>
        <p>
          <b>
            You are responsible for to backing up the data your entered into
            this app.
          </b>{" "}
          This app's provider cannot be held liable for any data loss.
        </p>
        <p>
          By using this app, you hereby and forever indemnify and hold harmless
          this app's maker from and against any and all legal actions, claims,
          demands, liabilities, damages, obligations, losses, costs or expenses
          whatsoever in any way connected with or arising out of use of this
          app. By using this app, you also acknowledge and agree that you are
          solely responsible for any decisions or actions you take based on the
          information provided by, or use of this app.
        </p>
      </Container>
    </div>
  );
}

export default TermsPage;
