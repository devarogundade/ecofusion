import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import ProjectsView from "../views/ProjectsView.vue";
import MarketplaceView from "../views/MarketplaceView.vue";
import SubmitView from "@/views/SubmissionView.vue";
import LeaderboardView from "@/views/LeaderboardView.vue";
import RegisterView from "@/views/RegisterView.vue";
import NewReserveView from "@/views/NewReserveView.vue";
import DonationView from "@/views/DonationView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/projects",
      name: "projects",
      component: ProjectsView,
    },
    {
      path: "/submission",
      name: "submission",
      component: SubmitView,
    },
    {
      path: "/leaderboard",
      name: "leaderboard",
      component: LeaderboardView,
    },
    {
      path: "/marketplace",
      name: "marketplace",
      component: MarketplaceView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/new-reserve",
      name: "new-reserve",
      component: NewReserveView,
    },
    {
      path: "/donations/:id",
      name: "donations",
      component: DonationView,
    },
  ],
});

export default router;
