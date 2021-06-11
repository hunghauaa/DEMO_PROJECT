const routes = [
  { path: "/", component: () => import("pages/login.vue") },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/dashboard",
        component: () => import("pages/dashboard.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "/dashboard_v2",
        component: () => import("pages/dashboard_v2.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "/dashboard_v3",
        component: () => import("pages/dashboard_v3.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "/customer_management",
        component: () => import("pages/customer_management.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "/change_request",
        component: () => import("pages/change_request.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "/my_profile",
        component: () => import("pages/my_profile.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "/sales_invoices",
        component: () => import("pages/sales_invoices.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "/quotes",
        component: () => import("pages/quotes.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "/transactions",
        component: () => import("pages/transactions.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "/employee_salary_list",
        component: () => import("pages/employee_salary_list.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "/calendar",
        component: () => import("pages/calendar.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "/department",
        component: () => import("pages/department.vue"),
        meta: { requiresAuth: true }
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
