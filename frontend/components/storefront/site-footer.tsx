export function SiteFooter() {
  return (
    <footer className="bg-surface-container-low w-full py-space-xl border-t border-surface-container-highest mt-auto">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-heading-md text-on-surface-variant font-semibold">
          BoldEra Prints
        </div>
        <div className="flex flex-wrap justify-center gap-space-md">
          <a
            href="#"
            className="text-body-sm text-on-surface-variant hover:text-primary hover:underline transition-all"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-body-sm text-on-surface-variant hover:text-primary hover:underline transition-all"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-body-sm text-on-surface-variant hover:text-primary hover:underline transition-all"
          >
            Shipping Policy
          </a>
          <a
            href="#"
            className="text-body-sm text-on-surface-variant hover:text-primary hover:underline transition-all"
          >
            Refund Policy
          </a>
        </div>
        <div className="text-body-sm text-on-surface opacity-90">
          © {new Date().getFullYear()} BoldEra Prints. Powered by Medusa.
        </div>
      </div>
    </footer>
  )
}
