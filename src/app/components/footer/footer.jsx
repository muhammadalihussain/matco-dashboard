import styles from "./footer.module.css";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        Developed by Muhammad Ali Hussain (Software Engineer)
      </div>
      <div className={styles.text}>© Matco Foods Ltd.All rights reserved.</div>
    </div>
  );
};

export default Footer;
