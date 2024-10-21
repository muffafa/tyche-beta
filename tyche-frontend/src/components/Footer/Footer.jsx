import tycheLogo from "../../assets/images/tyche.svg"; // logoyu svg olarak aldım png çözünürlüğü düşük

function Footer() {
  return (
    <footer className="bg-tycheGray py-4 md:py-6 px-4 md:px-0 w-full mt-10">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-[915px] mx-auto rounded-[20px] md:rounded-[40px]">
        {/* Logo Section */}
        <div className="logo-container flex items-center mb-4 md:mb-0">
          <img src={tycheLogo} alt="Tyche Logo" className="h-6 md:h-8" />
        </div>

        {/* Copyright Section */}
        <div className="copyright-container text-center text-[10px] md:text-[12px] mb-4 md:mb-0">
          © 2024 Tyche <br /> All Rights Reserved
        </div>

        {/* Contact Link Section */}
        <div className="contact-link">
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://github.com/usetyche/tyche-beta"
            className="text-tycheBlue text-[12px] md:text-[14px]"
          >
            Github Repo
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
