const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.jsx');
let appContent = fs.readFileSync(appPath, 'utf8');

// 1. Add import
if (!appContent.includes('import logo from "../assets/mvfx_logo.svg";')) {
    appContent = appContent.replace(
        'import React, { useState, useEffect } from "react";',
        'import React, { useState, useEffect } from "react";\nimport logo from "../assets/mvfx_logo.svg";'
    );
}

// 2. Update sidebar-logo
const oldLogo = `<div className="sidebar-logo">
          MV<span style={{ color: "var(--accent)" }}>.</span>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>×</button>
        </div>`;

const newLogo = `<div className="sidebar-logo" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", borderBottom: "1px solid var(--border)", paddingBottom: "15px", marginBottom: "15px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%" }}>
            <img src={logo} alt="MVFX Logo" style={{ height: "32px", width: "auto" }} />
            <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)} style={{ marginLeft: "auto" }}>×</button>
          </div>
          <div style={{ fontSize: "10px", letterSpacing: "2px", color: "var(--text)", fontWeight: "600", opacity: 0.9 }}>MIGUEL VIRGÍLIO STUDIO</div>
        </div>`;

appContent = appContent.replace(oldLogo, newLogo);

fs.writeFileSync(appPath, appContent);

// 3. Scale up the logo slightly in CSS if needed, but I'll do it inline first.
// Actually, let's also update dynamic.css to remove the old text-shadow and fixed font-size from .sidebar-logo
const cssPath = path.join(__dirname, 'src', 'dynamic.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

cssContent = cssContent.replace(
    /\.sidebar-logo \{[\s\S]*?\}/,
    `.sidebar-logo {
  padding: 0 20px 20px;
  color: var(--accent);
  font-family: var(--font-head);
  display: flex;
  flex-direction: column;
}`
);

fs.writeFileSync(cssPath, cssContent);

console.log("Updated logo and studio name in sidebar.");
