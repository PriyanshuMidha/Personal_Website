const AppShell = ({ sidebar, topbar, children }) => (
  <div className="min-h-screen bg-background bg-dashboard-radial text-text-primary">
    <div className="workspace py-4 md:py-6">
      <div className="shell overflow-hidden">
        <div className="grid min-h-[calc(100vh-2rem)] lg:grid-cols-[auto_minmax(0,1fr)]">
          {sidebar}
          <div className="min-w-0 bg-panel/90">
            {topbar}
            <main className="min-h-0 p-4 md:p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AppShell;
