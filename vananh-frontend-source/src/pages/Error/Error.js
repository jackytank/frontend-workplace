import { useNavigate } from 'react-router-dom';
import styles from '../../assets/styles/Error/Error.module.css';
export default function Error() {
  //const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className={styles.layout}>
      <div className={styles.item}>
        <img src="./images/404.gif" />
        <p>Invalid path</p>
        <a
          style={{ cursor: 'pointer' }}
          onClick={() => {
            navigate('');
          }}
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
