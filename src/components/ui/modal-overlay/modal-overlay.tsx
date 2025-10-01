import { FC } from 'react';
import styles from './modal-overlay.module.css';

export const ModalOverlayUI: FC<{ onClick: () => void; dataCy?: string }> = ({
  onClick,
  dataCy
}) => <div data-cy={dataCy} className={styles.overlay} onClick={onClick} />;
