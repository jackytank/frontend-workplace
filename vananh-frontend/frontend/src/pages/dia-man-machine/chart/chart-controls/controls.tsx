import * as d3 from 'd3';
import { HvButton, HvMultiButton, HvTooltip } from '@hitachivantara/uikit-react-core';
import { DefaultCursor, Move, ZoomIn, ZoomOut } from '@hitachivantara/uikit-react-icons';
import React, { useState } from 'react';
import classes from './styles';
import { useTranslation } from 'react-i18next';

const ChartControls = ({ scale, svgRef, zoomSource, mode, setMode }) => {
  const svg = d3.select(svgRef.current);
  // const [mode, setMode] = useState<string>('none');
  const { t } = useTranslation();

  function onClickHandler(buttonName: string) {
    if (mode === buttonName) return;
    if (mode === 'none') {
      svg.select('.zoom-area').style('pointer-events', 'all');
      setMode('all');
    } else {
      svg.select('.zoom-area').style('pointer-events', 'none');
      setMode('none');
    }
  }

  const onClickHandlerZoomIn: React.MouseEventHandler<HTMLButtonElement> = () => {
    svg.select('.zoom-area').call(zoomSource.zoomBehavior.scaleTo, zoomSource.transform.k + 0.1);
  };

  const onClickHandlerZoomOut: React.MouseEventHandler<HTMLButtonElement> = () => {
    svg.select('.zoom-area').call(zoomSource.zoomBehavior.scaleTo, zoomSource.transform.k - 0.1);
  };

  return (
    <>
      <div className={classes.controlbar} style={{ flexWrap: 'wrap' }}>
        <span className={classes.scaleLabel}> {t('mode')} </span>
        <HvMultiButton
          style={{
            width: '210px'
          }}
          variant="secondarySubtle">
          <HvButton
            onClick={() => onClickHandler('none')}
            startIcon={<DefaultCursor />}
            selected={mode === 'none' ? true : false}>
            {t('select')}
          </HvButton>
          <HvButton
            onClick={() => onClickHandler('all')}
            startIcon={<Move />}
            selected={mode === 'all' ? true : false}>
            {t('move')}
          </HvButton>
        </HvMultiButton>

        <span className={classes.scaleLabel}>
          {' '}
          {t('zoomScale')} {scale || '1.0'}
        </span>
        <HvTooltip placement="left" title="Zoom In">
          <HvButton
            onClick={onClickHandlerZoomIn}
            icon
            variant="secondarySubtle"
            style={{ marginRight: 5 }}
            disabled={mode !== 'all' || scale >= 20 ? true : false}>
            <ZoomIn />
          </HvButton>
        </HvTooltip>
        <HvTooltip placement="left" title="Zoom Out">
          <HvButton
            onClick={onClickHandlerZoomOut}
            icon
            variant="secondarySubtle"
            disabled={mode !== 'all' || scale <= 0.25 ? true : false}>
            <ZoomOut />
          </HvButton>
        </HvTooltip>
      </div>
    </>
  );
};

export { ChartControls };
