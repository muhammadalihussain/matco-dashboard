import { MdSupervisedUserCircle } from "react-icons/md";
import styles from "./card.module.css";

const Card = ({ item }) => {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.texts}>
          <span className={styles.title}>{item.title}</span>
          <span className={styles.number}>{item.number}</span>
        </div>

        <div className={styles.texts}>
          <span className={styles.title}>{item.last}</span>
          <span className={styles.number}>{item.value}</span>
        </div>

        <span className={styles.detail}>
          <span className={item.change > 0 ? styles.positive : styles.negative}>
            {item.change}%
          </span>{" "}
          {item.change > 0 ? "more" : "less"} than {item.last}
        </span>
      </div>
    </div>
  );
};

export default Card;
