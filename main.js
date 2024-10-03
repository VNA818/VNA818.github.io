import initCursor from "./modules/cursor.js";
import initProjects from "./modules/projects.js";
import initRouter from "./modules/router.js";
import initNav from "./modules/nav.js";
import initServerInfo, { hideSidebar } from "./modules/serverInfo.js";

window.onload = () => {
  initNav();
  initCursor();
  initRouter([ initProjects, hideSidebar ]);
  initServerInfo();
}