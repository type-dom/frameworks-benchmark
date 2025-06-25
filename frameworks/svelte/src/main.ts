
// const app = new App({
//   target: document.getElementById('app')!,
// });
//
// export default app;
import { mount } from "svelte";
// import Main from "./app/Rows.svelte";
import App from './app/app.svelte';
//
mount(App, {
  target: document.querySelector("#main")!,
});
