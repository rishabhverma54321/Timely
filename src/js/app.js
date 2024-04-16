import { h, render, Component } from "preact";
import Popup from "../components/Popup"

document.addEventListener("DOMContentLoaded", () => {
  render(<Popup />, document.body);
});