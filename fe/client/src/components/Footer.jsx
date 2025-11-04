import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          © {currentYear} - Website dạy học Toán
        </p>
        <p className="footer-text">
          Trường THCS Như Quỳnh
        </p>
      </div>
    </footer>
  );
};

export default Footer;
