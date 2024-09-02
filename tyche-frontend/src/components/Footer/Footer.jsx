function Footer() {
  return (
    <footer className="footer-container bg-tycheGray text-tycheWhite p-4 flex justify-between items-center">
      <div className="logo-container">
        <img src="/tyche.png" alt="Tyche Logo" className="h-8" />
      </div>
      <div className="copyright-container text-center">
        © 2024 Tyche <br /> Tüm Hakları Saklıdır
      </div>
      <div className="contact-link">
        <a href="/contact" className="text-tycheBlue">
          İletişim
        </a>
      </div>
    </footer>
  );
}

export default Footer;
