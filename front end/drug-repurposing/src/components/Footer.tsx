import { Link } from "react-router-dom"

const FOOTER_LINKS = {
  Platform: [
    { label: "Prediction Dashboard", to: "/dashboard" },
    { label: "Model Architecture", to: "/models" },
    { label: "How It Works", to: "/explanation" },
    { label: "API Access", to: "/about" },
  ],
  Science: [
    { label: "DREAMwalk", to: "/models#dreamwalk" },
    { label: "XGBoost", to: "/models#xgboost" },
    { label: "TxGNN", to: "/models#txgnn" },
    { label: "Hetionet", to: "/models#hetionet" },
  ],
  Company: [
    { label: "About Us", to: "/about" },
    { label: "Research", to: "/about#research" },
    { label: "Publications", to: "/about#publications" },
    { label: "Contact", to: "/about#contact" },
  ],
}

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src="/images/logo/logo.png" alt="Digilians Perfect Heros" className="w-8 h-8 object-contain" />
              <span className="font-semibold text-sm">
                Digilians Perfect Heros
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Advancing therapeutic discovery through multi-layer network learning and graph foundation models.
            </p>
          </div>
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Digilians Perfect Heros. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted">Research Use Only</span>
            <span className="text-xs text-muted">Privacy Policy</span>
            <span className="text-xs text-muted">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
