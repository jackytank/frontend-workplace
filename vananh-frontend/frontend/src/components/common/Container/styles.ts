import { css } from '@emotion/css';
import { theme } from '@hitachivantara/uikit-styles';

const styles = {
  root: css({
    display: 'flex',
    paddingTop: `calc(${theme.header.height})`,
    paddingBottom: '1px',
    minHeight: `calc(${window.innerHeight}px - 40px)`,
    alignItems: 'center'
  })
};

export default styles;
