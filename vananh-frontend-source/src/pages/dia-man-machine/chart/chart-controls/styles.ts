import { css } from '@emotion/css';
import { theme } from '@hitachivantara/uikit-styles';

const styles = {
  controlbar: css({
    position: 'absolute',
    right: theme.space.sm,
    display: 'flex',
    padding: theme.space.sm,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }),
  scaleLabel: css({
    margin: '10px',
    marginLeft: '30px'
  })
};

export default styles;
