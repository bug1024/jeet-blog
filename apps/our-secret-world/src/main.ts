import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

const root = document.querySelector<HTMLElement>("#our-secret-world-app");
if (root) createApp(App).mount(root);
