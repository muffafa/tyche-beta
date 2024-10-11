import tycheLogo from "../../assets/images/tyche.svg"; // logoyu svg olarak aldım png çözünürlüğü düşük

function Footer() {
  return (
    <footer className="footer-container bg-tycheGray py-6 flex justify-between items-center w-full max-w-[915px] mx-auto mt-10 rounded-[40px]">
      {/* Logo Section */}
      <div className="logo-container flex items-center">
        <img src={tycheLogo} alt="Tyche Logo" className="h-8" />{" "}
        {/* New logo */}
      </div>

      {/* Copyright Section */}
      <div className="copyright-container text-center text-[12px]">
        © 2024 Tyche <br /> All Rights Reserved
      </div>

      {/* Contact Link Section */}
      <div className="contact-link">
        <a
          target="_blank"
          rel="noreferrer noopener"
          href="https://github.com/muffafa/tyche-beta"
          className="text-tycheBlue text-[14px]"
        >
          Github Repo
        </a>
      </div>
    </footer>
  );
}

export default Footer;
