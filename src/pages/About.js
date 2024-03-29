import React from "react";
import { Container } from "react-bootstrap";
import NavBar from "../components/NavBar";
import { MY_WEB_ADDRESS } from "../utils/constants";

function AboutPage() {
  return (
    <div className="wrapper">
      <NavBar />
      <Container className="settings">
        <h1>About</h1>
        <p>Track your menstrual cycles, one cycle at a time.</p>
        <ol>
          <li>Start with a new cycle.</li>
          <li>Record your data by adding daily entries.</li>
          <li>
            Review, annotate, reflect, predict, act, & learn using the chart.
          </li>
          <li>Export / Save / Backup your data.</li>
          <li>Repeat.</li>
        </ol>
        <p>
          🛠️ Made & developed by <a href={MY_WEB_ADDRESS}>Grace Chin</a>.
        </p>
        <h3>
          Why is it called "<i>Red Moon</i>"?
        </h3>
        <p>
          It is a metaphor for the menstrual cycle. Like the moon, menstruation
          occurs in cycles and goes through phases (except that it is more red
          and probably less regular).
        </p>
      </Container>
    </div>
  );
}

export default AboutPage;
