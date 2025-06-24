// import App from './app/Rows.svelte';
//
// const app = new App({
//   target: document.getElementById('app')!,
// });
//
// export default app;
import { mount } from "svelte";
import Main from "./app/Rows.svelte";

mount(Main, {
  target: document.querySelector("#main")!,
});
