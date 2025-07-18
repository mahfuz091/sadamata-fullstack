import Link from "next/link";
import React from "react";

const DashboardSidebar = () => {
  return (
    <aside class="dashboard-area__list-area">
      <div class="dashboard-area__list-area__item">
        <h2 class="dashboard-area__list-area__title">Menu</h2>
        <ul class="dashboard-area__list list-unstyled">
          <li>
            <a href="dashboard" class="active">
              Dashboard
            </a>
          </li>
          <li>
            <a href="#">Create</a>
          </li>
          <li>
            <Link href="/dashboard-manage">Manage</Link>
          </li>
          <li>
            <a href="#">Analyze</a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
