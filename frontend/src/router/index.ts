import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/list",
        name: "ListView",
        component: () => import(/* webpackChunkName: "listview" */ "../views/ListView.vue")
      },
      {
        path: "/board",
        name: "Board",
        component: () => import(/* webpackChunkName: "board" */ "../views/Board.vue")
      },
      {
        path: "/calendar",
        name: "Calendar",
        component: () => import(/* webpackChunkName: "calendar" */ "../views/Calendar.vue")
      },
    ]
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
];

function routerBase(): string {
  const base = process.env.BASE_URL as string || "/"
  return base.endsWith("static/") ? base.substring(0, base.length - 7) : base;
}
const router = createRouter({
  history: createWebHistory(routerBase()),
  routes
});

export default router;
