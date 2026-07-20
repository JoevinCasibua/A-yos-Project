import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import Sidebar from './src/components/Sidebar.jsx';
import { AuthProvider } from './src/context/AuthContext.jsx';

try {
  const html = renderToString(
    <StaticRouter location="/admin/dashboard">
      <AuthProvider>
        <Sidebar isCollapsed={false} setIsCollapsed={() => {}} />
      </AuthProvider>
    </StaticRouter>
  );
  console.log("SUCCESS:", html.substring(0, 100));
} catch (e) {
  console.error("RENDER_ERROR:", e);
}
